const WebSocket = require('ws');

const sockets = new Map();

const createAlert = (userId, alert) => {
    let socket = sockets.get(userId);

    if (!socket) {
        socket = new WebSocket(`wss://ws.finnhub.io?token=${process.env.FINNHUB_API_KEY}`);
        sockets.set(userId, { socket, alerts: [] });

        socket.addEventListener('open', function (event) {
            socket.send(JSON.stringify({ type: 'subscribe', symbol: alert.ticker }));
        });

        socket.addEventListener('message', function (event) {
            const message = JSON.parse(event.data).data[0];
            const currentPrice = message.p;

            for (const userAlert of sockets.get(userId).alerts) {
                if (userAlert.ticker === message.s) {
                    const alertThresholdCrossed = userAlert.tradingPriceAboveAlertPrice
                        ? currentPrice <= userAlert.alertPrice
                        : currentPrice >= userAlert.alertPrice;

                    if (alertThresholdCrossed) {
                        deleteAlert(userId, userAlert, false);
                        sendMessage(userAlert);
                    }
                }
            }
        });
    }

    sockets.get(userId).alerts.push(alert);

    socket.send(JSON.stringify({ type: 'subscribe', symbol: alert.ticker }));
};

const deleteAlert = async (userId, alert, manuallyDeleted) => {
    const socket = sockets.get(userId);

    if (!socket) {
        return;
    }

    const alertIndex = socket.alerts.findIndex((userAlert) => userAlert._id === alert._id);

    if (alertIndex !== -1) {
        try {
            socket.send(JSON.stringify({ type: 'unsubscribe', symbol: symbol }));

            socket.alerts.splice(alertIndex, 1);

            if (socket.alerts.length === 0) {
                socket.socket.close();
                sockets.delete(userId);
            }

            if (!manuallyDeleted) {
                await fetch(`/api/alerts/${alert._id}`, {
                    method: 'DELETE',
                });
            }
        } catch (error) {
            console.log(error.message);
        }
    } else {
        console.log('Alert not found');
    }
};

const sendMessage = async (alert) => {
    await fetch('/api/twilio/send-message', {
        method: 'POST',
        body: { ...alert },
    });
};

module.exports = {
    createAlert,
    deleteAlert,
};

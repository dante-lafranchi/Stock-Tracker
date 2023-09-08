require('dotenv').config();

const express = require('express');
const stockRoutes = require('./routes/stockRoutes');
const userRoutes = require('./routes/userRoutes');
const alertRoutes = require('./routes/alertRoutes');
const twilioSMSRoutes = require('./routes/twilioSMSRoutes');
const mongoose = require('mongoose');

const app = express();
const cors = require('cors');

app.use(express.json());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.use(
    cors({
        origin: 'http://localhost:4200',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: true,
    })
);

app.use('/api/stocks', stockRoutes);
app.use('/api/user', userRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/twilio', twilioSMSRoutes);

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('connected to db listening on port 4500');
        });
    })
    .catch((err) => {
        console.log(err.message);
    });

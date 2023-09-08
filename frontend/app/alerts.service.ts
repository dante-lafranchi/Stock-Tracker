import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpClient
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AlertsService {
    alerts: any[] = [];
    isDataFetched: boolean = false;

    constructor(private userService: UserService, private http: HttpClient) {
        this.fetchAlerts();
    }

    async fetchAlerts() {
        const url = `http://localhost:4500/api/alerts/`;
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.userService.getUser().token}`,
        });

        try {
            const alertsResponse: any = await firstValueFrom(this.http.get(url, { headers }));

            this.alerts = alertsResponse;
            this.fetchAlertTradingPrices();
        } catch (error: any) {
            console.log(error);
        }
    }

    async fetchAlertTradingPrices() {
        for (let alert of this.alerts) {
            const url = `https://api.twelvedata.com/price?symbol=${alert.ticker}&apikey=${environment.twelvedataApiKey}`;

            try {
                const response: any = await firstValueFrom(this.http.get(url));

                alert.tradingPrice = parseFloat(response.price).toFixed(2);
            } catch (error: any) {
                console.log(error);
            }
        }

        this.isDataFetched = true;
    }

    async createAlert(alert: any) {
        const createAlertUrl = `http://localhost:4500/api/alerts/`;
        const body = {
            ...alert,
        };
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.userService.getUser().token}`,
        });

        try {
            const createAlertResponse: any = await firstValueFrom(this.http.post(createAlertUrl, body, { headers }));

            const url = `https://api.twelvedata.com/price?symbol=${alert.ticker}&apikey=${environment.twelvedataApiKey}`;

            const response: any = await firstValueFrom(this.http.get(url));
            createAlertResponse.tradingPrice = parseFloat(response.price).toFixed(2);

            this.alerts = [createAlertResponse, ...this.alerts];
        } catch (error: any) {
            console.log(error);
        }
    }

    async deleteAlert(alert: any) {
        const deleteAlertUrl = `http://localhost:4500/api/alerts/${alert._id}`;
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.userService.getUser().token}`,
        });

        try {
            const deleteAlertResponse: any = await firstValueFrom(this.http.delete(deleteAlertUrl, { headers }));

            this.alerts = this.alerts.filter((alert) => alert._id !== deleteAlertResponse._id);
        } catch (error: any) {
            console.log(error);
        }
    }

    getAlerts() {
        return this.alerts;
    }

    setAlerts(alerts: any[]) {
        this.alerts = alerts;
    }

    getIsDataFetched() {
        return this.isDataFetched;
    }
}

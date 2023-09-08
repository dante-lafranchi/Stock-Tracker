import { Component } from '@angular/core';
import { AlertsService } from '../alerts.service';

@Component({
    selector: 'app-alert-form',
    templateUrl: './alert-form.component.html',
})
export class AlertFormComponent {
    companyName: string = '';
    ticker: string = '';
    alertPrice: number = 0;
    error: string = '';
    isLoading: boolean = false;

    constructor(private alertsService: AlertsService) {}

    async createAlert(event: any) {
        event.preventDefault();
        this.error = '';

        if (!this.companyName || !this.ticker || !this.alertPrice) {
            this.error = 'All fields are required';
            return;
        }

        this.isLoading = true;

        const alert = {
            companyName: this.companyName,
            ticker: this.ticker,
            alertPrice: this.alertPrice,
        };

        try {
            this.alertsService.createAlert(alert);

            this.companyName = '';
            this.ticker = '';
            this.alertPrice = 0;
        } catch (error: any) {
            this.error = error.error.error;
            console.log(error);
        }

        this.isLoading = false;
    }
}

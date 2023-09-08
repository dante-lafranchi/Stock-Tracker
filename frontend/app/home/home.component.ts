import { Component } from '@angular/core';
import { StocksService } from '../stocks.service';
import { AlertsService } from '../alerts.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
})
export class HomeComponent {
    constructor(private stocksService: StocksService, private alertsService: AlertsService) {}

    get dataFetched(): boolean {
        return this.stocksService.getIsDataFetched() && this.alertsService.getIsDataFetched();
    }

    get stocks(): any {
        return this.stocksService.getStocks();
    }

    get alerts(): any {
        return this.alertsService.getAlerts();
    }
}

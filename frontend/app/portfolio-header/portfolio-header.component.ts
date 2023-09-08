import { Component } from '@angular/core';
import { StocksService } from '../stocks.service';

@Component({
    selector: 'app-portfolio-header',
    templateUrl: './portfolio-header.component.html',
})
export class PortfolioHeaderComponent {
    constructor(private stocksService: StocksService) {}

    get portfolioValue(): number {
        return parseFloat(this.stocksService.getPortfolioValue().toFixed(2));
    }
}

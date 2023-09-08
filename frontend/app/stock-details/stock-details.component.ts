import { Component, Input, OnInit } from '@angular/core';
import { StocksService } from '../stocks.service';

@Component({
    selector: 'app-stock-details',
    templateUrl: './stock-details.component.html',
})
export class StockDetailsComponent implements OnInit {
    @Input() stock: any;
    tradingPrice: number = 0;
    costValue: number = 0;
    marketValue: number = 0;
    percentChange: number = 0;
    dollarChange: number = 0;
    modifiedDateBought: string = '';
    showUpdateForm: boolean = false;

    constructor(private stocksService: StocksService) {}

    ngOnInit(): void {
        const stockPrices = this.stocksService.getStockPrices();
        const price = stockPrices[this.stock.ticker].price;
        this.tradingPrice = parseFloat(parseFloat(price).toFixed(2));

        this.costValue = parseFloat((this.stock.pricePaid * this.stock.numShares).toFixed(2));
        this.marketValue = parseFloat((this.tradingPrice * this.stock.numShares).toFixed(2));
        this.percentChange = parseFloat((((this.marketValue - this.costValue) / this.costValue) * 100).toFixed(2));
        this.dollarChange = parseFloat((this.marketValue - this.costValue).toFixed(2));

        let modifiedDate = this.stock.dateBought.split('-');
        let year = modifiedDate[0];
        let month = modifiedDate[1].replace('0', '');
        let day = modifiedDate[2].replace('0', '');

        this.modifiedDateBought = `${month}/${day}/${year}`;
    }

    toggleUpdateForm() {
        this.showUpdateForm = !this.showUpdateForm;
    }
}

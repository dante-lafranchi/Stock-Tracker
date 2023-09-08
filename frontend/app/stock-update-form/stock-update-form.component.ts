import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StocksService } from '../stocks.service';

@Component({
    selector: 'app-stock-update-form',
    templateUrl: './stock-update-form.component.html',
})
export class UpdateFormComponent implements OnInit {
    @Input() stock: any;
    companyName: string = '';
    ticker: string = '';
    numShares: number = 0;
    pricePaid: number = 0;
    dateBought: any = '';
    error: string = '';
    isLoading: boolean = false;
    isUpdated: boolean = false;

    constructor(private stocksService: StocksService, private http: HttpClient) {}

    ngOnInit(): void {
        this.companyName = this.stock.companyName;
        this.ticker = this.stock.ticker;
        this.numShares = this.stock.numShares;
        this.pricePaid = this.stock.pricePaid;
        this.dateBought = this.stock.dateBought;
    }

    async updateStock(event: any) {
        event.preventDefault();
        this.error = '';

        if (!this.companyName || !this.ticker || !this.numShares || !this.pricePaid || !this.dateBought) {
            this.error = 'All fields are required';
            return;
        }

        this.isLoading = true;

        const stock = {
            companyName: this.companyName,
            ticker: this.ticker,
            numShares: this.numShares,
            pricePaid: this.pricePaid,
            dateBought: this.dateBought,
            _id: this.stock._id,
        };

        try {
            this.stocksService.updateStock(stock);

            this.isUpdated = true;
        } catch (error: any) {
            this.error = error.error.error;
        }

        this.isLoading = false;
    }

    async deleteStock() {
        this.error = '';
        this.isLoading = true;

        try {
            this.stocksService.deleteStock(this.stock);

            this.isUpdated = true;
        } catch (error: any) {
            this.error = error.error.error;
        }

        this.isLoading = false;
    }
}

import { Component } from '@angular/core';
import { StocksService } from '../stocks.service';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http'; // Import HttpClient here

@Component({
    selector: 'app-stock-form',
    templateUrl: './stockform.component.html',
})
export class StockformComponent {
    companyName: string = '';
    ticker: string = '';
    numShares: number = 0;
    pricePaid: number = 0;
    dateBought: string = '';
    error: string = '';
    isLoading: boolean = false;

    constructor(private userService: UserService, private stocksService: StocksService, private http: HttpClient) {}

    async addStock(event: any) {
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
        };

        try {
            this.stocksService.createStock(stock);

            this.companyName = '';
            this.ticker = '';
            this.numShares = 0;
            this.pricePaid = 0;
            this.dateBought = '';
        } catch (error: any) {
            this.error = error.error.error;
            console.log(error);
        }

        this.isLoading = false;
    }
}

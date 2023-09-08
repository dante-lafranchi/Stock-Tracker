import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpClient
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class StocksService {
    stockPurchaseData: any[] = [];
    stockPriceData: any;
    portfolioValue: number = 0;
    isDataFetched: boolean = false;

    constructor(private userService: UserService, private http: HttpClient) {
        this.fetchStockTickers();
    }

    async fetchStockTickers() {
        const url = `http://localhost:4500/api/stocks/`;
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.userService.getUser().token}`,
        });

        try {
            const stocksResponse: any = await firstValueFrom(this.http.get(url, { headers }));

            this.stockPurchaseData = stocksResponse;

            this.fetchStockData();
        } catch (error: any) {
            console.log(error);
        }
    }

    async fetchStockData() {
        this.portfolioValue = 0;
        const tickers = this.stockPurchaseData.map((stock: any) => stock.ticker);

        const url = `https://api.twelvedata.com/price?symbol=${tickers.join(',')}&apikey=${
            environment.twelvedataApiKey
        }`;

        try {
            const stockDataResponse: any = await firstValueFrom(this.http.get(url));

            if (tickers.length === 1) {
                this.stockPriceData = { [tickers[0]]: { ...stockDataResponse } };
            } else {
                this.stockPriceData = stockDataResponse;
            }

            for (let stock of this.stockPurchaseData) {
                this.portfolioValue += parseFloat(this.stockPriceData[stock.ticker].price) * stock.numShares;
            }
        } catch (error: any) {
            console.log(error);
        }

        this.isDataFetched = true;
    }

    getStocks() {
        return this.stockPurchaseData;
    }

    setStocks(stocks: any[]) {
        this.stockPurchaseData = stocks;
    }

    getStockPrices() {
        return this.stockPriceData;
    }

    getPortfolioValue() {
        return this.portfolioValue;
    }

    getIsDataFetched() {
        return this.isDataFetched;
    }

    async createStock(stock: any) {
        const createStockUrl = `http://localhost:4500/api/stocks/`;
        const body = {
            ...stock,
        };
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.userService.getUser().token}`,
        });

        try {
            await firstValueFrom(this.http.post(createStockUrl, body, { headers }));
        } catch (error: any) {
            console.log(error);
        }

        const getStockPriceUrl = `https://api.twelvedata.com/price?symbol=${stock.ticker}&apikey=${environment.twelvedataApiKey}`;

        try {
            const stockDataResponse: any = await firstValueFrom(this.http.get(getStockPriceUrl));

            this.portfolioValue += parseFloat(stockDataResponse.price) * stock.numShares;

            this.stockPriceData = {
                ...stockDataResponse,
                [stock.ticker]: { ...stockDataResponse },
            };

            this.stockPurchaseData = [stock, ...this.stockPurchaseData];
        } catch (error: any) {
            console.log(error);
        }
    }

    async updateStock(stock: any) {
        const updateStockUrl = `http://localhost:4500/api/stocks/${stock._id}`;
        const body = {
            ...stock,
        };
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.userService.getUser().token}`,
        });

        try {
            await firstValueFrom(this.http.patch(updateStockUrl, body, { headers }));

            const updatedStock = this.stockPurchaseData.find((s) => s.ticker === stock.ticker);

            if (updatedStock) {
                const tradingPrice = parseFloat(this.stockPriceData[stock.ticker].price);

                this.portfolioValue -= updatedStock.numShares * tradingPrice;
                this.portfolioValue += stock.numShares * tradingPrice;

                this.stockPurchaseData = this.stockPurchaseData.map((s) => (s.ticker === stock.ticker ? stock : s));
            }
        } catch (error: any) {
            console.log(error);
        }
    }

    async deleteStock(stock: any) {
        const deleteStockUrl = `http://localhost:4500/api/stocks/${stock._id}`;
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.userService.getUser().token}`,
        });

        try {
            await firstValueFrom(this.http.delete(deleteStockUrl, { headers }));

            this.stockPurchaseData = this.stockPurchaseData.filter((s: any) => s.ticker !== stock.ticker);
        } catch (error: any) {
            console.log(error);
        }
    }
}

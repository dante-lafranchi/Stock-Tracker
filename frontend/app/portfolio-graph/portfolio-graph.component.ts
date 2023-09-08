import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { StocksService } from '../stocks.service';

import {
    Chart,
    Tooltip,
    LinearScale,
    CategoryScale,
    Title,
    Legend,
    ArcElement,
    PointElement,
    LineController,
    LineElement,
} from 'chart.js';
import { HttpClient } from '@angular/common/http';

Chart.register(
    Tooltip,
    LinearScale,
    CategoryScale,
    Title,
    Legend,
    ArcElement,
    PointElement,
    LineController,
    LineElement
);

@Component({
    selector: 'app-portfolio-graph',
    templateUrl: './portfolio-graph.component.html',
})
export class PortfolioGraphComponent implements OnInit {
    @Input() stocks: any[] = [];
    private chart: Chart | undefined;

    constructor(private http: HttpClient, private stocksService: StocksService) {}

    ngOnInit(): void {
        this.initializeChart();
    }

    async initializeChart(): Promise<void> {
        const ctx = document.getElementById('canvas') as HTMLCanvasElement;

        const portfolioValueOverTime = await this.fetchData();
        const labels = this.getLastSixMonthsMondays();

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        data: portfolioValueOverTime,
                        backgroundColor: '#106CC2',
                        borderColor: '#106CC2',
                        tension: 0.4,
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'nearest',
                        intersect: false,
                        callbacks: {
                            label: function (context) {
                                const value = context.parsed.y.toFixed(2);
                                return '$' + value;
                            },
                        },
                        titleFont: {
                            weight: 'normal',
                        },
                    },
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                    },
                    y: {
                        ticks: {
                            callback: (value) => '$' + value,
                        },
                    },
                },
            },
        });
    }

    async fetchData(): Promise<number[]> {
        const portfolioValueOverTime: number[] = new Array(30).fill(0);

        for (const stock of this.stocks) {
            const response = await this.http
                .get(
                    `https://api.twelvedata.com/time_series?symbol=${stock.ticker}&interval=1week&output=90&apikey=${environment.twelvedataApiKey}`
                )
                .toPromise();
            const data: any = response;

            for (let i = 0; i < 30; i++) {
                portfolioValueOverTime[i] += stock.numShares * data.values[i].close;
            }
        }

        for (let i = 1; i < portfolioValueOverTime.length; i++) {
            portfolioValueOverTime[i] = parseFloat(portfolioValueOverTime[i].toFixed(2));

            if (i % 1 === 0) {
                portfolioValueOverTime.splice(i, 1);
            }
        }

        portfolioValueOverTime.reverse();

        return portfolioValueOverTime;
    }

    getLastSixMonthsMondays(): string[] {
        const dates: string[] = [];
        const today = new Date();
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const dayOfWeek = sixMonthsAgo.getDay();
        const diff = (dayOfWeek + 6) % 7;
        sixMonthsAgo.setDate(sixMonthsAgo.getDate() - diff);

        let currentDate = new Date(sixMonthsAgo);
        while (currentDate <= today) {
            dates.push(currentDate.toLocaleDateString('en-US'));
            currentDate.setDate(currentDate.getDate() + 7);
        }

        for (let i = 0; i < dates.length; i++) {
            const dateObject = new Date(dates[i]);
            dates[i] = dateObject.toLocaleDateString('en-US');
        }

        dates.reverse();

        for (let i = 1; i < dates.length; i++) {
            if (i % 1 === 0 && dates.length > 15) {
                dates.splice(i, 1);
            }

            switch (dates.length) {
                case 6:
                    dates[i] = dates[i].substring(0, 6) + dates[i].substring(8, 10);
                    break;
            }
        }

        return dates;
    }
}

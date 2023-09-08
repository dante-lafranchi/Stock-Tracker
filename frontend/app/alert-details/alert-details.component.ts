import { Component, Input, OnInit } from '@angular/core';
import { AlertsService } from '../alerts.service';

@Component({
    selector: 'app-alert-details',
    templateUrl: './alert-details.component.html',
})
export class AlertDetailsComponent implements OnInit {
    @Input() alert: any;
    modifiedDateCreated: string = '';
    isLoading: boolean = false;

    constructor(private alertsService: AlertsService) {}

    ngOnInit(): void {
        let modifiedCreatedAt = this.alert.createdAt.toString().substring(0, 10).split('-');
        let year = modifiedCreatedAt[0];
        let month = modifiedCreatedAt[1].replace('0', '');
        let day = modifiedCreatedAt[2].replace('0', '');

        this.modifiedDateCreated = `${month}/${day}/${year}`;
    }

    async deleteAlert() {
        this.isLoading = true;

        try {
            this.alertsService.deleteAlert(this.alert);
        } catch (error: any) {
            console.log(error);
        }

        this.isLoading = false;
    }
}

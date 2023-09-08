import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent {
    phoneNumber: string = '';
    password: string = '';
    error: string = '';
    isLoading: boolean = false;

    constructor(private http: HttpClient, private userService: UserService, private router: Router) {}

    async login(event: Event) {
        event.preventDefault();
        this.error = '';

        if (!this.phoneNumber || !this.password) {
            this.error = 'All fields are required';
            return;
        }

        this.isLoading = true;

        const url = `http://localhost:4500/api/user/login`;
        const body = {
            phoneNumber: this.phoneNumber,
            password: this.password,
        };
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        try {
            const loginResponse: any = await firstValueFrom(this.http.post(url, body, { headers }));

            localStorage.setItem('user', JSON.stringify(loginResponse));
            this.userService.setUser(loginResponse);
            this.router.navigate(['/']);
        } catch (error: any) {
            this.error = error.error.error;
            console.log(this.error);
        }

        this.isLoading = false;
    }
}

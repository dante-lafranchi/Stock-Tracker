import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
})
export class SignupComponent {
    phoneNumber: string = '';
    password: string = '';
    otp: string = '';
    error: string = '';
    otpSent: boolean = false;
    isLoading: boolean = false;

    constructor(private http: HttpClient, private userService: UserService, private router: Router) {}

    async sendOtp(event: Event) {
        event.preventDefault();

        this.error = '';

        if (!this.phoneNumber || !this.password) {
            this.error = 'Phone number and password are required';
            return;
        }
        if (this.phoneNumber.length <= 10) {
            this.phoneNumber = '1' + this.phoneNumber;
        }

        this.isLoading = true;

        const url = `http://localhost:4500/api/twilio/send-otp`;
        const body = {
            phoneNumber: this.phoneNumber,
        };
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        try {
            await firstValueFrom(this.http.post(url, body, { headers }));
        } catch (error: any) {
            this.error = error.error.error;
            console.log(error);
        }

        this.otpSent = true;
        this.isLoading = false;
    }

    async verifyOtp(event: Event) {
        event.preventDefault();

        this.error = '';

        if (!this.otp) {
            this.error = 'OTP is required';
            return;
        }

        this.isLoading = true;

        const url = `http://localhost:4500/api/twilio/verify-otp`;
        const body = {
            phoneNumber: this.phoneNumber,
            otp: this.otp,
        };
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        try {
            await firstValueFrom(this.http.post(url, body, { headers }));
            this.signup();
        } catch (error: any) {
            this.isLoading = false;
            this.error = error.error.error;
            console.log(error);
        }
    }

    async signup() {
        this.error = '';

        const url = `http://localhost:4500/api/user/signup`;
        const body = {
            phoneNumber: this.phoneNumber,
            password: this.password,
        };
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        try {
            const signupResponse: any = await firstValueFrom(this.http.post(url, body, { headers }));

            localStorage.setItem('user', JSON.stringify(signupResponse));
            this.userService.setUser(signupResponse);
            this.router.navigate(['/']);
        } catch (error: any) {
            this.error = error.error.error;
            console.log(this.error);
        }

        this.isLoading = false;
    }
}

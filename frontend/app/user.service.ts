import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private user: any = null;

    constructor() {
        let user = localStorage.getItem('user');

        if (user) {
            this.user = JSON.parse(user);
        }
    }

    setUser(user: any) {
        this.user = user;
    }

    getUser() {
        return this.user;
    }
}

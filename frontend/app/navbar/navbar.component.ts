import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
})
export class NavbarComponent {
    constructor(
        private userService: UserService,
        private router: Router
    ) {}

    get user(): any {
        return this.userService.getUser();
    }

    async logout() {
        this.userService.setUser(null);

        localStorage.removeItem('user');

        this.router.navigate(['/login']);
    }
}

import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { UserService } from './user.service'; // Assuming you have a UserService
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard {
    constructor(private userService: UserService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const targetPath = route.data['targetPath'];

        if (!this.userService.getUser()) {
            this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
                if (this.router.url === '/') {
                    this.router.navigate(['/login']);
                }
            });

            return true;
        } else {
            if (targetPath !== '/') {
                this.router.navigate(['/']);
                return false;
            } else {
                return true;
            }
        }
    }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard], data: { targetPath: '/' } },
    { path: 'signup', component: SignupComponent, canActivate: [AuthGuard], data: { targetPath: '/signup' } },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard], data: { targetPath: '/login' } },
    { path: '**', redirectTo: '/' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}

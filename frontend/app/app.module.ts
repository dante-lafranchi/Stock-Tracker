import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { UserService } from './user.service';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PortfolioGraphComponent } from './portfolio-graph/portfolio-graph.component';
import { PortfolioHeaderComponent } from './portfolio-header/portfolio-header.component';
import { StockformComponent } from './stockform/stockform.component';
import { StockDetailsComponent } from './stock-details/stock-details.component';
import { StockTableHeaderComponent } from './stock-table-header/stock-table-header.component';
import { AlertFormComponent } from './alert-form/alert-form.component';
import { UpdateFormComponent } from './stock-update-form/stock-update-form.component';
import { AlertDetailsComponent } from './alert-details/alert-details.component';
import { AlertTableHeaderComponent } from './alert-table-header/alert-table-header.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SignupComponent,
        LoginComponent,
        NavbarComponent,
        PortfolioGraphComponent,
        PortfolioHeaderComponent,
        StockformComponent,
        StockDetailsComponent,
        StockTableHeaderComponent,
        AlertFormComponent,
        UpdateFormComponent,
        AlertDetailsComponent,
        AlertTableHeaderComponent,
    ],
    imports: [BrowserModule, FormsModule, HttpClientModule, RouterModule, AppRoutingModule],
    providers: [UserService],
    bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AllFormsModule, MaterialModule, CdkModule } from './modules';
import { AppRoutingModule, routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import { TabsNamePartComponent } from './components/tabs/tabs-name-part/tabs-name-part.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { HeaderComponent } from './components/login-page/header/header.component';
import { ForgotPasswordComponent } from './components/login-page/forgot-password/forgot-password.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import {MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { CreateProjectPageComponent } from './components/create-project/create-project-page/create-project-page.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { HomepageComponent } from './components/homepage/homepage.component';
import { SummaryComponent } from './components/summary/summary.component';
import { ChartComponent } from './components/summary/chart/chart.component';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    NavbarComponent,
    TabsComponent,
    TabsNamePartComponent,
    LoginPageComponent,
    HeaderComponent,
    ForgotPasswordComponent,
    CreateProjectComponent,
    CreateProjectPageComponent,
    HomepageComponent,
    SummaryComponent,
    ChartComponent,
    HttpClientModule
  ],
  imports: [
    AllFormsModule,
    MaterialModule,
    CdkModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatSidenavModule,
    NgChartsModule
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

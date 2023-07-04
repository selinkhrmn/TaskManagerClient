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

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    NavbarComponent,
    TabsComponent,
  ],
  imports: [
    AllFormsModule,
    MaterialModule,
    CdkModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

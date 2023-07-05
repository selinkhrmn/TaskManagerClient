import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent, SidenavComponent, TabsComponent } from './components';
import { ForgotPasswordComponent } from './components/login-page/forgot-password/forgot-password.component';

export const routes: Routes = [

  {
    path: "",
    component: NavbarComponent
  },
  {
    path: "sidenav",
    component: SidenavComponent
  },
  {
    path: "tabs",
    component: TabsComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

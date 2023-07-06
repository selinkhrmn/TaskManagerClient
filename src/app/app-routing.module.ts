import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent, SidenavComponent, TabsComponent } from './components';
import { ForgotPasswordComponent } from './components/login-page/forgot-password/forgot-password.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { SummaryComponent } from './components/summary/summary.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';



export const routes: Routes = [
  
  { path: 'summary', component: SummaryComponent },
  {
    path: "",
    component:HomepageComponent 
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'summary',
    component: SummaryComponent
  },
  {
    path: 'create-project',
    component: CreateProjectComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

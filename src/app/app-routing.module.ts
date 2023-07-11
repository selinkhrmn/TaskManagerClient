import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent, Sidenav2Component, TabsComponent } from './components';
import { ForgotPasswordComponent } from './components/login-page/forgot-password/forgot-password.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { SummaryComponent } from './components/summary/summary.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { CreateIssueDialogComponent } from './components/create-issue-dialog/create-issue-dialog.component';
import { BoardComponent } from './components/board/board.component';

export const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
    children: [
      {
        path: 'summary',
        component: SummaryComponent,
      },
      {
        path: 'project-settings',
        component: ProjectDetailsComponent,
      },
      {
        path: 'create-issue-dialog',
        component: CreateIssueDialogComponent,
      },
      {
        path: 'board',
        component: BoardComponent,
      }
    ],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },

  {
    path: 'create-project',
    component: CreateProjectComponent,
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

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
import { TaskComponent } from './components/task/task.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { canActivateGuard } from './guards/guards.guard';

export const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
  },
  {
    path: 'home',
    component: HomepageComponent,
    canActivate: [canActivateGuard],
    children: [
      {
        path: 'summary',
        component: SummaryComponent,
      },
      {
        path: 'calendar',
        component: CalendarComponent,
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
      },
      {
        path: 'task',
        component: TaskComponent,
      }
    ],
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
  //providers:[canActivateGuard],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

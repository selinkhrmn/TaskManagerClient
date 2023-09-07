import { Component, NgModule } from '@angular/core';
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
import { canActivateGuard, isAdminGuard, isLoggedIn, loginCheck } from './guards/guards.guard';
import { PasswordChangePageComponent } from './components/password-change-page/password-change-page.component';
import { ListComponent } from './components/list/list.component';
import { AddPeopleToProjectComponent } from './components/create-project/add-people-to-project/add-people-to-project.component';
import { UserSettingComponent } from './components/user-setting/user-setting.component';
import { TaskSettingPageComponent } from './components/task-setting-page/task-setting-page.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { AdminSidenavComponent } from './components/admin-page/admin-sidenav/admin-sidenav.component';
import { AdminProjectsComponent } from './components/admin-page/admin-projects/admin-projects.component';
import { AdminTasksComponent } from './components/admin-page/admin-tasks/admin-tasks.component';
import { AdminUsersComponent } from './components/admin-page/admin-users/admin-users.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { ProfileSettingPageComponent } from './components/profile-setting-page/profile-setting-page.component';
import { ChattingComponent } from './components/chatting/chatting.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
    canActivate: [loginCheck]
  },
  {
    path: 'home',
    component: HomepageComponent,
    canActivate: [canActivateGuard,isLoggedIn],
    children: [
      {
        path: 'summary',
        component: SummaryComponent,
        canActivate: [canActivateGuard,isLoggedIn],
      },
      {
        path: 'list',
        component: ListComponent,
        canActivate: [canActivateGuard],

      },
      {
        path: 'calendar',
        component: CalendarComponent,
        canActivate: [canActivateGuard],

      },
      {
        path: 'chatting',
        component: ChattingComponent,
        canActivate: [canActivateGuard, isAdminGuard],
      },
      {
        path: 'project-settings',
        component: ProjectDetailsComponent,
        canActivate: [canActivateGuard, isAdminGuard],
      },
      {
        path: 'create-issue-dialog',
        component: CreateIssueDialogComponent,
        canActivate: [canActivateGuard, isAdminGuard],
      },
      {
        path: 'board',
        component: BoardComponent,
        canActivate: [canActivateGuard],
      },
      {
        path: 'task',
        component: TaskComponent,
        canActivateChild: [canActivateGuard],
      },
      {
        path: 'task-setting',
        component: TaskSettingPageComponent,
        canActivateChild: [canActivateGuard, isAdminGuard],
      },
      {
        path: 'user-setting',
        component: UserSettingComponent,
        canActivateChild: [canActivateGuard,],
      }
    ],
  },
  {
    path: 'create-project',
    component: CreateProjectComponent,
    canActivate: [canActivateGuard],
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'password-change',
    component: PasswordChangePageComponent
  },
   {
    path: 'admin-page',
    component : AdminPageComponent,
    canActivateChild: [canActivateGuard, isAdminGuard],
    children : [
      {
        path: 'admin-projects',
        component : AdminProjectsComponent,
        canActivateChild: [canActivateGuard, isAdminGuard],
      },
      {
        path: 'admin-tasks',
        canActivateChild: [canActivateGuard, isAdminGuard],
        component : AdminTasksComponent,
      },
      {
        path: 'admin-users',
        component : AdminUsersComponent,
        canActivateChild: [canActivateGuard, isAdminGuard],

      },
    ]
   },
   
  {
    path: 'profile-setting',
    component : ProfileSettingPageComponent,
    canActivate: [canActivateGuard],
   },
   {
    path: '**',
    component: ErrorPageComponent //error component gerekli...
  }
];

@NgModule({
  // providers:[canActivateGuard],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

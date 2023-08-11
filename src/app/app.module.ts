import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AllFormsModule, MaterialModule, CdkModule } from './modules';
import { AppRoutingModule, routes } from './app-routing.module';
import { AppComponent } from './app.component';
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

import { NgChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BoardComponent } from './components/board/board.component';
import { LittleMainComponentsComponent } from './components/little-main-components/little-main-components.component';
import { AddPeopleComponent } from './components/little-main-components/add-people/add-people.component';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { AddPeoplePageComponent } from './components/add-people-page/add-people-page.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { Sidenav2Component } from './components/sidenav2/sidenav2.component';
import { PasswordChangePageComponent } from './components/password-change-page/password-change-page.component';
import { CreateIssueDialogComponent } from './components/create-issue-dialog/create-issue-dialog.component';
import { SearchBarComponent } from './components/little-main-components/search-bar/search-bar.component';
import { ColumnsComponent } from './components/board/columns/columns.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { TaskComponent } from './components/task/task.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { EditColumnComponent } from './components/board/edit-column/edit-column.component';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { CalendarComponent } from './components/calendar/calendar.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { ListComponent } from './components/list/list.component';
import { AddPeopleToProjectComponent } from './components/create-project/add-people-to-project/add-people-to-project.component';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { TaskSettingPageComponent } from './components/task-setting-page/task-setting-page.component';
import { TranslocoRootModule } from './transloco-root.module';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { DialogComponent } from './components/user-setting/dialog/dialog.component';
import { UserSettingComponent } from './components/user-setting/user-setting.component';
import { AdminSidenavComponent } from './components/admin-page/admin-sidenav/admin-sidenav.component';
import { AdminProjectsComponent } from './components/admin-page/admin-projects/admin-projects.component';
import { AdminUsersComponent } from './components/admin-page/admin-users/admin-users.component';
import { AdminTasksComponent } from './components/admin-page/admin-tasks/admin-tasks.component';
import { UserPipe } from 'src/pipes/user.pipe';
import { AddUsersToProjectComponent } from './components/admin-page/admin-projects/add-users-to-project/add-users-to-project.component';
import { NbLayoutModule, NbSidebarModule, NbThemeModule } from '@nebular/theme';
import { ResizableModule } from 'angular-resizable-element';


@NgModule({
  declarations: [
    AppComponent,
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
    BoardComponent,
    LittleMainComponentsComponent,
    AddPeopleComponent,
    AddPeoplePageComponent,
    ProjectDetailsComponent,
    Sidenav2Component,
    PasswordChangePageComponent,
    SearchBarComponent,
    ColumnsComponent,
    CreateIssueDialogComponent,
    ColumnsComponent,
    TaskComponent,
    EditColumnComponent,
    CalendarComponent,
    RegisterPageComponent,
    ListComponent,
    AddPeopleToProjectComponent,
    AdminPageComponent,
    DialogComponent,
    UserSettingComponent,
    AdminPageComponent,
    AdminSidenavComponent,
    AdminProjectsComponent,
    AdminTasksComponent,
    UserPipe,
    AddUsersToProjectComponent
    

  ],
  imports: [
    AdminUsersComponent,
    TaskSettingPageComponent,
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
    NgChartsModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    DragDropModule,
    AngularEditorModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    NbLayoutModule,
    NbSidebarModule,
    NbThemeModule,
    ResizableModule,
    
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token')
      }
    }),
    MatRadioModule,
    TranslocoRootModule
  ],

  providers: [JwtHelperService,
    {
      provide: MatDialogRef,
      useValue: {}
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }

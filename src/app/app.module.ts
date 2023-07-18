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
import {MatDialogModule} from '@angular/material/dialog';
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
    NgChartsModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    DragDropModule,
    AngularEditorModule,
    FormsModule,
    HttpClientModule 
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateIssueDialogComponent } from '../create-issue-dialog/create-issue-dialog.component';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
    constructor(
      public dialog : MatDialog,
      public tokenService: TokenService
    ) {}

    openCreateIssueDialog() {
      const dialog = this.dialog.open(CreateIssueDialogComponent, {width:'60%'});
    }
}

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateIssueDialogComponent } from '../create-issue-dialog/create-issue-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
    constructor(
      public dialog : MatDialog
    ) {}

    openCreateIssueDialog() {
      const dialog = this.dialog.open(CreateIssueDialogComponent, {width:'60%'});
    }
}

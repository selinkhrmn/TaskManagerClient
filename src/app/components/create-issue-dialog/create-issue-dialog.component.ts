import { Component } from '@angular/core';
import { Project } from 'src/app/interfaces';

@Component({
  selector: 'app-create-issue-dialog',
  templateUrl: './create-issue-dialog.component.html',
  styleUrls: ['./create-issue-dialog.component.scss']
})
export class CreateIssueDialogComponent {
  project : Project[] = [];

  //yeni issue
  createIssue(): void {
    
  }
}

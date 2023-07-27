import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { FormControl, Validators } from '@angular/forms'; // Import FormControl and Validators

@Component({
  selector: 'app-root',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.css'],
})
export class UserSettingComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  roleFormControl = new FormControl(''); // Create the roleFormControl

  constructor(private dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%'
    });
  }

  openManageRoles() {
    // Implement the function logic here
    // For example:
    console.log('Manage Roles clicked');
  }
}

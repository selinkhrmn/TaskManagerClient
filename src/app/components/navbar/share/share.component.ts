import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { User, UserDto } from 'src/app/interfaces/user';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { ProjectUserListForEmail } from 'src/app/interfaces/projectUserDto';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})

export class ShareComponent {
  id: string = '';
  message: string = '';
  justArray: UserDto[] = [];
  userList = new FormControl();
  users: UserDto[] = [];
  allEmails: string[] = [];
  selectedUsers: ProjectUserListForEmail ={
    users: [],
    message: ''
  }

  constructor(
    public userService: UserService,
    private translocoService: TranslocoService,

  ) {}

  ngOnInit() {
   
  }
  ngAfterViewInit() {
    this.fetchTasks();
  }

  fetchTasks() {
    this.userService.getAllUsers().subscribe((res) => {
      if (res.isSuccessful) {
        this.users = res.data;
       
        console.log(this.users);
      }
    });
  }
  logit(event : MatSelectChange) {

    let theObj = event.value;
    this.selectedUsers.users.push(theObj[0].email.toString())
    console.log(typeof theObj[0].email.toString());
    console.log(this.selectedUsers);
    
    // this.allEmails = this.users.map(p => p.email)
    // this.selectedUsers.users = this.allEmails
    // console.log(this.allEmails);
    
  }
 
  stopPropagation(event: { stopPropagation: () => void }) {
    event.stopPropagation();
  }

  SendEmail() {
    this.selectedUsers.message = this.message;
    console.log(this.selectedUsers);
    
    this.userService.SendEmailToUsers(this.selectedUsers).subscribe((res) => {
      console.log(res);
      
    })
  }


  // Function to filter and update the autocomplete options
  // filterUserNames(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.userList
  //     .filter((user) => user.name.toLowerCase().includes(filterValue))
  //     .map((user) => user.name);
  // }

  // Handle autocomplete option selection


  someMethod(): void {
    const translatedText = this.translocoService.translate(
      'your_translation_key'
    );
    console.log(translatedText);
  }
}

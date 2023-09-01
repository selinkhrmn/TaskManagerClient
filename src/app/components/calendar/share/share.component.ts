import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UserDto } from 'src/app/interfaces/user';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent {
  id: string = '';
  message: string = '';
  justArray: UserDto[] = [];
  userList: UserDto[] = [];

  filteredUserNames: Observable<string[]>; // Değiştirilen tür

  constructor(public userService: UserService, private translocoService: TranslocoService) {}

  ngOnInit() {
    this.getUserList();

    // Initialize the filteredUserNames observable
    this.filteredUserNames = this.userService.getAllUsers().pipe(
      map((res) => res.data.map((user) => user.name)),
      startWith([]) // Başlangıçta boş bir dizi kullanarak başlayın
    );
  }

  getUserList() {
    this.userService.getAllUsers().subscribe((res) => {
      if (res.isSuccessful) {
        this.userList = res.data;
      }
    });
  }

  // Function to filter and update the autocomplete options
  filterUserNames(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.userList
      .filter((user) => user.name.toLowerCase().includes(filterValue))
      .map((user) => user.name);
  }

  // Handle autocomplete option selection
  onUserNameSelected(event: MatAutocompleteSelectedEvent) {
    this.id = event.option.viewValue;
  }

  paylas() {
    debugger;
    this.userService.getUserById(this.id).subscribe((res) => {
      this.justArray = res.data;
    });

    var emails = {
      message: this.message,
      users: this.justArray,
    };

    this.userService.SendEmailToUsers(emails);
  }

  someMethod(): void {
    const translatedText = this.translocoService.translate('your_translation_key');
    console.log(translatedText);
  }
}

import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { TranslocoService } from '@ngneat/transloco';
import { User, UserDto } from 'src/app/interfaces/user';
import { ProjectService, TaskService } from 'src/app/services';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { AddPeopleComponent } from '../../little-main-components/add-people/add-people.component';
import { MatDialog } from '@angular/material/dialog';
import { RegisterPageComponent } from '../../register-page/register-page.component';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule]
})
export class AdminUsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'surname', 'username', 'email'];
  dataSource: MatTableDataSource<UserDto>;
  users : UserDto[] = [];

  constructor(
    public translocoService : TranslocoService,
    public userService : UserService,
    public tokenService : TokenService,
    public dialog: MatDialog
  ) {
    
    
  }

  ngOnInit() {
    this.userService.getAllUsers().subscribe((res)=> {
    if(res.data != null ){
      this.users = res.data;
      console.log(this.users);
    } 

    this.dataSource = new MatTableDataSource<UserDto>(this.users);
    console.log(this.dataSource);
  });

  
  
  
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addPeople(){
    const dialogRef = this.dialog.open(RegisterPageComponent,{height: '90%',width: '30%', panelClass: 'dialog'});
  }
}

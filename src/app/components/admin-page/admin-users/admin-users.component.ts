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
    public tokenService : TokenService
  ) {
    
    
  }

  ngOnInit() {
    debugger
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
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { TranslocoService } from '@ngneat/transloco';
import { User, UserDto } from 'src/app/interfaces/user';
import { ProjectService, TaskService } from 'src/app/services';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { AddPeopleComponent } from '../../little-main-components/add-people/add-people.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegisterPageComponent } from '../../register-page/register-page.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PriorityService } from 'src/app/services/priority.service';
import Swal from 'sweetalert2';
import { CommentHubService } from 'src/app/services/comment-hub.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  users: UserDto[] = [];
  user: User[] = [];
  priorities: string[] = [];
  constructor(
    public translocoService: TranslocoService,
    public userService: UserService,
    public tokenService: TokenService,
    public dialog: MatDialog,
    public priorityService: PriorityService,
    private projectService: ProjectService,
    private commentHubService: CommentHubService
  ) { }

  displayedColumns: string[] = ['name', 'surname', 'username', 'email', 'actions'];
  dataSource = new MatTableDataSource<UserDto>(this.users);


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.fetchTasks();
    this.commentHubService.startConnection();
  }

  fetchTasks() {
    this.userService.getAllUsers().subscribe((res) => {
      if (res.isSuccessful) {
        this.users = res.data;
        this.dataSource = new MatTableDataSource<UserDto>(this.users);
        this.dataSource.paginator = this.paginator
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addPeople() {
    const dialogRef = this.dialog.open(RegisterPageComponent, { height: '80%', width: '30%', panelClass: 'dialog' });
  }

  openUserDetailDialog(id: any){
    console.log(id);
    
  }

  deleteUser(id: string){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.DeleteUserFromProject({projectId: this.projectService.getProjectLocal().id, users: [id]}).subscribe((res)=> {
          if(res.isSuccessful){
            Swal.fire(
              'Deleted!',
              'User has been deleted.',
              'success'
            )
          }
        })
       
      }
    })
    
  }

}

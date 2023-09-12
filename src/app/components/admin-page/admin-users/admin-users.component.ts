import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { TranslocoService } from '@ngneat/transloco';
import { User, UserConnection, UserDto } from 'src/app/interfaces/user';
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
import { LogService } from 'src/app/services/log.service';
import { DeleteUserDialogComponent } from '../../delete-user-dialog/delete-user-dialog.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private userStatusSubject = new BehaviorSubject<string[]>([]); // Define the BehaviorSubject

  userList3: UserConnection[] = [];
  userList4: UserConnection[] = [];
  userList2: string[] = [];
  users: UserDto[] = [];
  user: UserDto[] = [];
  priorities: string[] = [];
  ids: string[] = [];
  conIds: string[] = [];
  isConnected: boolean;
  getOneUser: UserDto = {
    selected: undefined,
    id: '',
    name: '',
    surname: '',
    username: '',
    email: '',
    role: '',
    isConnected: false,
  };
  user3: UserConnection = {
    connectionId: '',
    id: '',
  };
  userId: string;
  connected: boolean;

  constructor(
    public translocoService: TranslocoService,
    public userService: UserService,
    public tokenService: TokenService,
    public dialog: MatDialog,
    public priorityService: PriorityService,
    private projectService: ProjectService,
    private commentHubService: CommentHubService,
    private logService: LogService,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) { }

  displayedColumns: string[] = [
    'name',
    'surname',
    'username',
    'email',
    'role',
    'isConnected',
    'actions',
  ];
  dataSource = new MatTableDataSource<UserDto>(this.users);

  ngOnInit() {
    debugger;
    this.commentHubService.startConnection();

    this.fetchTasks();

    this.commentHubService.userJoined((connectionId) => {
      if (!this.ids.includes(connectionId)) {
        this.ids.push(connectionId);

        let userId = this.tokenService.tokenUserId();
        this.commentHubService.AllUsers(userId);
        this.commentHubService.GetAllUsers((user) => {
          if (this.userList4.find((u) => u.id == user.id) != null) {
            return;
          } else {
            this.userList4.push(user);
            this.users.find((u) => u.id == user.id).isConnected = true;
            this.connected = true;
            this.dataSource.data = [...this.users];
          }
        });
      } else {
        return;
      }
    });

    this.commentHubService.userLeaved((ConnectionId) => {
      debugger;

      let id = this.userList4.find((u) => u.connectionId == ConnectionId).id;

      this.commentHubService.AllUsers(id);
      this.commentHubService.GetAllUsers((user) => {
        console.log(user);
        console.log(this.users);
        const index = this.userList4.indexOf(user);
        this.userList4.splice(index, 1)
        this.users.find((u) => u.id == user.id).isConnected = false;
        this.connected = false;
        console.log(this.connected);

        this.dataSource.data = [...this.users];
      });
    });

    this.dataSource.paginator = this.paginator;
  }

  fetchTasks() {
    this.userService.getAllUsers().subscribe((res) => {
      if (res.isSuccessful) {
        debugger;
        console.log(res.data);
        this.users = res.data;

        this.dataSource.paginator = this.paginator;
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
    console.log(this.users);

    const dialogRef = this.dialog.open(RegisterPageComponent, {
      height: '80%',
      width: '30%',
      panelClass: 'dialog',
    });
  }

  openUserDetailDialog(id: any) {
    console.log(id);
  }

  getUserLogs(userId: string) {
    console.log(userId);

    let projects: number[] = [2, 3];
    this.logService.getUserLogs(projects, userId).subscribe((res) => {
      console.log(res);
    });
  }


  userDeleteWithHandleTasks(id: string, role: string) {
    debugger;
    if(this.tokenService.hasRole('Admin') && (role == '4dc5874d-f3be-459a-b05f-2244512d13e3' || role == '6a2c4fe5-5b10-45b6-a1f6-7cfecc629d3f')){
      Swal.fire({
        icon: 'error',
        title: 'You are not allowed to delete this user!',
        showConfirmButton: false
      })
      return;
    }
    else if(this.tokenService.hasRole('SuperAdmin') && (role == '4dc5874d-f3be-459a-b05f-2244512d13e3' )){
      Swal.fire({
        icon: 'error',
        title: 'This user cannot be deleted!',
        showConfirmButton: false
      })
      return;
    }
    let projectId = this.projectService.getProjectLocal().id;
    this.taskService.GetAllProjectTaskForUser(projectId, id).subscribe((res) => {
      if (res.isSuccessful) {
        console.log(res);
        const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
          data: { userId: id, tasks: res.data, projectId: this.projectService.getProjectLocal().id, getAllUsers: this.users }, width: '40%'
        });
        dialogRef.afterClosed().subscribe((result) => {
          // this.ngOnInit();
        });
      }
    })

  }

  /*
   openEditDialog(columnName: string, currentColumnId: number) {
    const dialogRef = this.dialog.open(EditColumnComponent, {
      data: { data: columnName, currentColumnId: currentColumnId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }
  */

}

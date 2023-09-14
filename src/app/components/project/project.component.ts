import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FileData } from 'src/app/interfaces/FileData';
import { Project, ProjectDto } from 'src/app/interfaces/project';
import { ProjectUserDto, ProjectUserList } from 'src/app/interfaces/projectUserDto';
import { UserDto } from 'src/app/interfaces/user';
import { ProjectService } from 'src/app/services';
import { FileService } from 'src/app/services/file.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { DeleteUserDialogComponent } from '../delete-user-dialog/delete-user-dialog.component';



interface DialogData {
  project: Project;
}


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  projectId: number = this.data.project.id;
  projectName: string = this.data.project.name;
  fileUploaded: boolean = false;
  descriptionText: string = '';
  Files: FileData[];
  project: Project = JSON.parse(JSON.stringify(this.data.project));
  addSubtopicClicked = false;

  projects: Project[] = [];
  userList: UserDto[] = [];
  projectUsers: ProjectUserDto[] = [];
  public isPanelOpen = false;

  public paginatedUsers: any[] = [];
  public currentPage = 1;
  public itemsPerPage = 5;
  public searchInputValue: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private projectService: ProjectService,
    private userService: UserService,
    private fileService: FileService,
    public tokenService: TokenService,
    private dialogRef: MatDialogRef<ProjectComponent>,
    public dialog: MatDialog,
  ) { }



  ngOnInit(): void {
    this.GetProject();
    console.log("bak");
    console.log(this.data.project);


    this.userService.GetProjectSelectedUsers(this.projectId).subscribe((res) => {
      this.projectUsers = res.data;
      this.userService.getAllUsers().subscribe((res) => {
        if (res.isSuccessful == true) {
          this.userList = res.data;
          this.projectUsers.forEach(projectUser => {
            const user = this.userList.find(user => user.id === projectUser.userId);
            if (user) {
              const name = user.name.charAt(0).toUpperCase() + user.name.slice(1);
              const surname = user.surname.charAt(0).toUpperCase() + user.surname.slice(1);
              projectUser.id = name + ' ' + surname;
            }
          })
        }
      });
      this.updatePaginatedUsers();
    })
  }

  updatePaginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    if (this.searchInputValue.trim() === '') {
      this.paginatedUsers = this.projectUsers.slice(startIndex, endIndex);
    } else {
      this.paginatedUsers = this.projectUsers.filter(user =>
        user.userId.toLowerCase().includes(this.searchInputValue.toLowerCase())
      );
    }
  }

  changePage(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.updatePaginatedUsers();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchInputValue = filterValue;
    this.updatePaginatedUsers();
  }

  clearSearch() {
    this.searchInputValue = '';
    this.updatePaginatedUsers();
  }

  GetProject() {
    this.projectService.getProject({ "id": this.projectId }).subscribe((res) => {
      if (res.isSuccessful == true) {
        this.projects = res.data;
      }
    })
  }

  upload(event: Event) {
    this.fileUploaded = true;
    this.fileService.uploadFile(event);
    this.Files = this.fileService.selectedFiles;
  }

  onSave() {
  }

  updateProject() {
    if (JSON.stringify(this.data.project) != JSON.stringify(this.project)) {
      this.projectService.updateProject(this.project).subscribe((res) => {
        console.log(res.data);
      })
    }
  }

  deleteUser(id: string, role: string) {
    
    if (this.tokenService.hasRole('Admin') && (role == '4dc5874d-f3be-459a-b05f-2244512d13e3' || role == '6a2c4fe5-5b10-45b6-a1f6-7cfecc629d3f')) {
      Swal.fire({
        icon: 'error',
        title: 'You are not allowed to delete this user!',
        showConfirmButton: false
      })
      return;
    }
    else if (this.tokenService.hasRole('SuperAdmin') && (role == '4dc5874d-f3be-459a-b05f-2244512d13e3')) {
      Swal.fire({
        icon: 'error',
        title: 'This user cannot be deleted!',
        showConfirmButton: false
      })
      return;
    }
    else {
      const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
        data: { userId: id, projectId: this.data.project.id, getAllUsers: this.userList }, width: '40%'
      });
      dialogRef.afterClosed().subscribe((result) => {
        // this.ngOnInit();
      });
    }

  }

  deleteProject() {
    if (this.data.project.createdByUser == this.tokenService.getTokenId()) {
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
          this.projectService.deleteProject(this.data.project.id).subscribe((res) => {
            if (res.isSuccessful) {
              Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
              )
              this.closeDialog();
            }
            else {

            }
          })

        }

      })
    }
    else {
      Swal.fire(
        'You are not allowed to delete this project!',
        'This project deleted by creator',
        'error'
      )
    }
  }


  closeDialog() {
    this.dialogRef.close();
  }
}


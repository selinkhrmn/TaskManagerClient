import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
    private dialogRef: MatDialogRef<ProjectComponent>
  ) { }



  ngOnInit(): void {
    this.GetProject();

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
    console.log('Description:', this.descriptionText);
    console.log('Selected Files:', this.Files);
  }

  updateProject() {
    console.log("comes");
    console.log(this.project);

    if (JSON.stringify(this.data.project) != JSON.stringify(this.project)) {
      console.log(this.data.project);
      console.log("****");
      console.log(this.project);



      this.projectService.updateProject(this.project).subscribe((res) => {
        console.log(res.data);
      })
    }
  }

  deleteUser(id: string) {
    Swal.fire({
      title: 'Do you want to delete this user?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.DeleteUserFromProject({projectId: this.projectId, users: [id]}).subscribe((res) => {
          if (res.isSuccessful == true) {
            Swal.fire('Saved!', '', 'success'),
            this.ngOnInit();
          }
        })
        Swal.fire('Saved!', '', 'success')
      } else if (result.isDenied) {
        console.log("not delete");
        Swal.fire('Changes are not saved', '', 'info')
      }
    })

  }

  closeDialog() {
    this.dialogRef.close();
  }



}


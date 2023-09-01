import { Component, OnInit, SimpleChanges } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CreateProjectPageComponent } from './create-project-page/create-project-page.component';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/interfaces';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService} from '@ngneat/transloco';
import notie from 'notie'
import { ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, style, transition, trigger } from '@angular/animations';
import Swal from 'sweetalert2';
import { AddPeopleToProjectComponent } from './add-people-to-project/add-people-to-project.component';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0ms', style({ transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class CreateProjectComponent implements OnInit {
  projectName : string;
  projects : Project[] = [];
  data: Object ;
  isVisible = false;
  showFirstComponent = true;
  showSecondComponent = false;
  projectNameIsEmpty: boolean;
  private openDialogRef: MatDialogRef<AddPeopleToProjectComponent>;

  constructor(
    private bottomSheet: MatBottomSheet,
    public projectService: ProjectService,
    public dialog: MatDialog,
    public translocoService : TranslocoService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.projectService.getAllProjects().subscribe((response) => {
      if(response.data != null){
        this.projects = response.data;
      }
    });
  }

  ngOnChanges(changes : SimpleChanges) {
  
  }
   
  createProject(){
    console.log(this.projectName);
    debugger
    if(this.projectName == '' || this.projectName ==  null || this.projectName == undefined ){
      this.projectNameIsEmpty = true;
    }
    else {
      this.projectService.createProject({name: this.projectName, description: ""}).subscribe((res) => {
      this.selectedProject(res.data);
      if(res.isSuccessful == true) {
        Swal.fire({
          title: 'You successfully created a project!',
          text: "Would you like to add some user into your project?",
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, go for it!'
        }).then((result) => {
          
          if (result.isConfirmed) {
            this.dialog.closeAll()
            const dialogRef = this.dialog.open(AddPeopleToProjectComponent,{autoFocus: false,height: '95.5%',width: '80%', panelClass: 'dialog'}); 
          }
          else {
            this.closeDialog();
          }
        })
      }

      // this.ngOnInit()
    });
    localStorage.setItem('newProject', this.projectName);
    }
    
  }


  closeDialog() {
    debugger
    this.dialog.closeAll()
    // this.dialog.afterOpened.subscribe((result)=>{
    //   if(result.afterClosed){
    //     this.createProject();
    //   }
    // })
    // const dialogRef = this.dialog.closeAll()
  }

  selectedProject(project: any) {
    this.projectService.setCurrentProject(project);
  }

  
}


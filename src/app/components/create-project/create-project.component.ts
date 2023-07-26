import { Component, OnInit, SimpleChanges } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CreateProjectPageComponent } from './create-project-page/create-project-page.component';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {
  projectName : string;
  projects : Project[] = [];
  data: Object ;
  isVisible = false;
  showFirstComponent = true;
  showSecondComponent = false;
  constructor(
    private bottomSheet: MatBottomSheet,
    public projectService: ProjectService,
    public dialog: MatDialog,
    public translocoService : TranslocoService
  ) {}

  ngOnInit() {
    this.projectService.getAllProjects().subscribe((response) => {
      if(response.data != null){
        this.projects = response.data;
      }
    });
  }

  ngOnChanges(changes : SimpleChanges) {
    console.log(changes);
    
  }
   
  createProject(){
    this.projectService.createProject({name: this.projectName}).subscribe((res) => {
      this.selectedProject(res.data);
      this.ngOnInit()
    });
  }


  closeDialog() {
    const dialogRef = this.dialog.closeAll()
  }

  selectedProject(project: any) {
    this.projectService.setCurrentProject(project);
  }



    

  showFiller = false;
  openBottomSheet() {
    this.bottomSheet.open(CreateProjectPageComponent, {
      
    });
  }

  onButtonClick() {
    this.showFirstComponent = false;
    this.showSecondComponent = true;
  }
}

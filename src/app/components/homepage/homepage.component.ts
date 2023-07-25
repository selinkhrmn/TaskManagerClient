import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/interfaces';
import { ProjectService } from 'src/app/services';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  projects : Project[];
  constructor(
    private projectService : ProjectService
  ){

  }

   ngOnInit(): void {
  //   this.projectService.getAllProjects().subscribe((response) => {
  //     if(response.data != null){
  //       this.projects = response.data;
  //       this.ngOnInit();
  //     }
  //   });
   }

  // public updateProject(){
  //   this.projectService.getAllProjects().subscribe((response) => {
  //     if(response.data != null){
  //       this.projects = response.data;
  //       this.ngOnInit();
  //     }
  //   });
  // }
}

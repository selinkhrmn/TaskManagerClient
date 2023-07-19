import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/interfaces';
import { ProjectService } from 'src/app/services';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  currentProject: Project;
  currentProjectName : string;

  constructor(public projectService: ProjectService){}

  ngOnInit(): void {
    this.projectService.selectedProject$.subscribe((value) => {
      this.currentProjectName = value.name;
    });
    this.currentProjectName = this.projectService.getCurrentProject()?.name;
  }

  projectImageUrl = '../../../assets/app-development.png';
  colorBucketImageUrl = '../../../assets/color-bucket.png';


  isGreen = false;
  isDarkBlue = false;
  isPurple = false;
  isBrown = false;
  isBlue = false;

  colorGreen() {
    this.isGreen = true;
    this.isDarkBlue = false;
    this.isPurple = false;
    this.isBrown = false;
    this.isBlue = false;

  }

  colorDarkBlue() {
    this.isDarkBlue = true;
    this.isPurple = false;
    this.isBrown = false;
    this.isBlue = false;
    this.isGreen = false;
  }

  colorPurple() {
    this.isPurple = true;
    this.isBrown = false;
    this.isBlue = false;
    this.isGreen = false;
    this.isDarkBlue = false;
  }

  colorBrown() {
    this.isBrown = true;
    this.isBlue = false;
    this.isGreen = false;
    this.isDarkBlue = false;
    this.isPurple = false;
  }

  colorBlue() {
    this.isBlue = true;
    this.isGreen = false;
    this.isDarkBlue = false;
    this.isPurple = false;
    this.isBrown = false;
  }


}

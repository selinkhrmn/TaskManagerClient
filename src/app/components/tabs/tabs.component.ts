import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {

  projectImageUrl = '../../../assets/app-development.png';
  colorBucketImageUrl = '../../../assets/color-bucket.png';
  projectName = 'ProjectName';

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

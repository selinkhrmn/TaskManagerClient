import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CreateProjectPageComponent } from './create-project-page/create-project-page.component';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent {

  constructor(private bottomSheet: MatBottomSheet) {

  }

  showFiller = false;
  openBottomSheet() {
    this.bottomSheet.open(CreateProjectPageComponent, {
      
    });
  }
}

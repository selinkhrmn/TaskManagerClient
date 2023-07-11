import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-columns',
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ColumnsComponent {
  @ViewChild('p') p: ElementRef;
  @Input() public column_name: string;
  @Input() public visibility: boolean;
  number_of_tasks = 0;
  inputText: string;
  priority = 'high';
  constructor(private renderer: Renderer2) {}

  onInputClick() {
    var element = <HTMLInputElement>document.getElementById('create_button');
    element.disabled = false;
  }

  createTask() {
    this.number_of_tasks++; //ileride dinamik olması için değiştirilecek
    const p: HTMLDivElement = this.renderer.createElement('p');
    var inputValue = (<HTMLInputElement>document.getElementById('input')).value;
    var element = <HTMLInputElement>document.getElementById('create_button');

    element.disabled = true;

    if (inputValue == '') {
      element.disabled = true;
    } else {
      
      p.innerHTML = `<div class='task_structure' cdkDrag>
      <p>${this.inputText}</p>
      <div class='delete_side'>
      <label>${this.priority}</label>
      <span class="material-icons">delete</span>
      </div>
      </div>`;

      this.renderer.appendChild(this.p.nativeElement, p);
      element.disabled = false;
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferColumnTaskComponent } from './transfer-column-task.component';

describe('TransferColumnTaskComponent', () => {
  let component: TransferColumnTaskComponent;
  let fixture: ComponentFixture<TransferColumnTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferColumnTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferColumnTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

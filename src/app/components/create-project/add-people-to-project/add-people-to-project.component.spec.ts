import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPeopleToProjectComponent } from './add-people-to-project.component';

describe('AddPeopleToProjectComponent', () => {
  let component: AddPeopleToProjectComponent;
  let fixture: ComponentFixture<AddPeopleToProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPeopleToProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPeopleToProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

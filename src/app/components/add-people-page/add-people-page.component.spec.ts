import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPeoplePageComponent } from './add-people-page.component';

describe('AddPeoplePageComponent', () => {
  let component: AddPeoplePageComponent;
  let fixture: ComponentFixture<AddPeoplePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPeoplePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPeoplePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

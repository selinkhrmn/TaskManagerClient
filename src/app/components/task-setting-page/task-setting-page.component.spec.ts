import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSettingPageComponent } from './task-setting-page.component';

describe('TaskSettingPageComponent', () => {
  let component: TaskSettingPageComponent;
  let fixture: ComponentFixture<TaskSettingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskSettingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskSettingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

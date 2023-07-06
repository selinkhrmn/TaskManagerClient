import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LittleMainComponentsComponent } from './little-main-components.component';

describe('LittleMainComponentsComponent', () => {
  let component: LittleMainComponentsComponent;
  let fixture: ComponentFixture<LittleMainComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LittleMainComponentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LittleMainComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

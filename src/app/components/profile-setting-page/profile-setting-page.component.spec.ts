import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSettingPageComponent } from './profile-setting-page.component';

describe('ProfileSettingPageComponent', () => {
  let component: ProfileSettingPageComponent;
  let fixture: ComponentFixture<ProfileSettingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileSettingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileSettingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

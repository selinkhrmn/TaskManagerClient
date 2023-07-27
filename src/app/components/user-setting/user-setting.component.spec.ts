import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserSettingComponent } from './user-setting.component';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [UserSettingComponent]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(UserSettingComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'admintab'`, () => {
    const fixture = TestBed.createComponent(UserSettingComponent);
    const app = fixture.componentInstance;
    expect(UserSettingComponent.title).toEqual('admintab');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(UserSettingComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('admintab app is running!');
  });
});

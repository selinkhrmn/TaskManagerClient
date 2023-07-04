import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsNamePartComponent } from './tabs-name-part.component';

describe('TabsNamePartComponent', () => {
  let component: TabsNamePartComponent;
  let fixture: ComponentFixture<TabsNamePartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabsNamePartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabsNamePartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

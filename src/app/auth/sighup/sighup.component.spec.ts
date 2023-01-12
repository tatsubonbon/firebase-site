import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SighupComponent } from './sighup.component';

describe('SighupComponent', () => {
  let component: SighupComponent;
  let fixture: ComponentFixture<SighupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SighupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SighupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetAccountComponent } from './forget-account.component';

describe('ForgetAccountComponent', () => {
  let component: ForgetAccountComponent;
  let fixture: ComponentFixture<ForgetAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgetAccountComponent]
    });
    fixture = TestBed.createComponent(ForgetAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

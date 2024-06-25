import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceDocteurComponent } from './interface-docteur.component';

describe('InterfaceDocteurComponent', () => {
  let component: InterfaceDocteurComponent;
  let fixture: ComponentFixture<InterfaceDocteurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterfaceDocteurComponent]
    });
    fixture = TestBed.createComponent(InterfaceDocteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

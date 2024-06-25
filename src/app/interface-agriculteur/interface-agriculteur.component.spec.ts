import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceAgriculteurComponent } from './interface-agriculteur.component';

describe('InterfaceAgriculteurComponent', () => {
  let component: InterfaceAgriculteurComponent;
  let fixture: ComponentFixture<InterfaceAgriculteurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterfaceAgriculteurComponent]
    });
    fixture = TestBed.createComponent(InterfaceAgriculteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

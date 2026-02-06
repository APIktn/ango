import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Employeelist } from './employeelist';

describe('Employeelist', () => {
  let component: Employeelist;
  let fixture: ComponentFixture<Employeelist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Employeelist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Employeelist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

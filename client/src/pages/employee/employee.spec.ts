import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EmployeeComponent } from './employee';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('EmployeeComponent', () => {
  let fixture: ComponentFixture<EmployeeComponent>;
  let component: EmployeeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}) // create mode
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: () => {}
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should start in create mode', () => {
    expect(component.isEdit).toBe(false);
    expect(component.emCode).toBe('');
  });

  it('should switch to edit mode manually', () => {
    component.isEdit = true;
    component.emCode = 'EMP001';

    expect(component.isEdit).toBe(true);
    expect(component.emCode).toBe('EMP001');
  });

  it('should build form correctly', () => {
    component.form.setValue({
      emFirstName: 'james',
      emLastName: 'bond',
      emDept: 'it',
      emPos: 'dev',
      emSalary: 50000
    });

    expect(component.form.valid).toBe(true);
  });
});

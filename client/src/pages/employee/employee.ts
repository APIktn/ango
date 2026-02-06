import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StatusModule } from '../../module/status/status-module';

@Component({
  standalone: true,
  selector: 'app-employee',
  imports: [CommonModule, ReactiveFormsModule, StatusModule],
  templateUrl: './employee.html',
  styleUrls: ['./employee.css'],

})
export class EmployeeComponent implements OnInit {

  form!: FormGroup;

  isEdit: boolean = false;
  emCode: string = '';
  loading: boolean = false;

  apiUrl = 'http://localhost:8080';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {

    // form
    this.form = this.fb.group({
      emFirstName: this.fb.control<string>(''),
      emLastName: this.fb.control<string>(''),
      emDept: this.fb.control<string>(''),
      emPos: this.fb.control<string>(''),
      emSalary: this.fb.control<number | null>(null),
    });

    // detect mode from route
    this.route.paramMap.subscribe(params => {
      const code = params.get('emCode');

      this.form.reset();
      this.loading = false;

      if (code) {
        // edit mode
        this.isEdit = true;
        this.emCode = code;
        this.getEmployeeByCode(code);
      } else {
        // create mode
        this.isEdit = false;
        this.emCode = '';
      }
    });

  }

  // ===== GET =====
  getEmployeeByCode(code: string): void {
    this.loading = true;

    this.http
      .get<any>(`${this.apiUrl}/employee?emcode=${code}`)
      .subscribe({
        next: (res) => {
          this.form.patchValue({
            emFirstName: res.em_first_name,
            emLastName: res.em_last_name,
            emDept: res.em_dept,
            emPos: res.em_pos,
            emSalary: res.em_salary,
          });
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  // ===== SUBMIT =====
  submit(): void {

    const payload = {
      em_first_name: this.form.value.emFirstName,
      em_last_name: this.form.value.emLastName,
      em_dept: this.form.value.emDept,
      em_pos: this.form.value.emPos,
      em_salary: this.form.value.emSalary,
    };

    // update
    if (this.isEdit) {
      this.http
        .put(`${this.apiUrl}/employee?emcode=${this.emCode}`, payload)
        .subscribe(() => { alert('update employee success'); });

      // create
    } else {
      this.http
        .post<any>(`${this.apiUrl}/employee`, payload)
        .subscribe(res => {
          alert('add employee success');
          this.router.navigate(
            ['/employee', res.em_code],
            { replaceUrl: true }
          );
        });
    }
  }

  // ===== DELETE =====
  delete(): void {
    if (!confirm('delete this employee?')) return;

    this.http
      .delete(`${this.apiUrl}/employee?emcode=${this.emCode}`)
      .subscribe(() => {
        this.router.navigate(['/employeelist']);
      });
  }

}



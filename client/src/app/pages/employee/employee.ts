import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-employee',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './employee.html',
})
export class EmployeeComponent implements OnInit {

  form!: FormGroup;

  isEdit: boolean = false;
  emCode: string = '';
  loading: boolean = false;

  apiUrl: string = 'http://localhost:8080';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    // ===== create form =====
    this.form = this.fb.group({
      emFirstName: [''],
      emLastName: [''],
      emDept: [''],
      emPos: [''],
      emSalary: [null],
    });

    // ===== mode by param =====
    this.route.queryParams.subscribe(params => {
      const code = params['emcode'];

      this.form.reset();
      this.loading = false;

      if (code) {
        // update mode
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
            emLastName:  res.em_last_name,
            emDept:      res.em_dept,
            emPos:       res.em_pos,
            emSalary:    res.em_salary,
          });

          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  // ===== submit =====
  submit(): void {

    const payload = {
      em_first_name: this.form.value.emFirstName,
      em_last_name:  this.form.value.emLastName,
      em_dept:       this.form.value.emDept,
      em_pos:        this.form.value.emPos,
      em_salary:     this.form.value.emSalary,
    };

    // ===== UPDATE =====
    if (this.isEdit) {
      this.http
        .put(`${this.apiUrl}/employee?emcode=${this.emCode}`, payload)
        .subscribe(() => {
        });

    // ===== CREATE =====
    } else {
      this.http
        .post<any>(`${this.apiUrl}/employee`, payload)
        .subscribe(res => {

          this.isEdit = true;
          this.emCode = res.em_code;

          this.router.navigate(
            ['/employee'],
            {
              queryParams: { emcode: res.em_code },
              replaceUrl: true
            }
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
        this.router.navigate(['/employee']);
      });
  }
}

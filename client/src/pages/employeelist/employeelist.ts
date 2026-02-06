import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employeelist',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './employeelist.html',
})
export class Employeelist implements OnInit {

  apiUrl = 'http://localhost:8080';

  employees: any[] = [];

  searchText: string = '';
  page: number = 1;
  limit: number = 5;

  total: number = 0;
  totalPage: number = 1;

  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.loading = true;

    this.http.get<any>(`${this.apiUrl}/allemployee`, {
      params: {
        search: this.searchText || '',
        page: this.page.toString(),
        limit: this.limit.toString(),
      }
    }).subscribe({
      next: (res) => {
        this.employees = res?.data || [];
        this.total = res?.total || 0;
        this.totalPage = Math.max(1, Math.ceil(this.total / this.limit));
        this.loading = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.employees = [];
        this.total = 0;
        this.totalPage = 1;
        this.loading = false;

        this.cdr.detectChanges();
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  search(): void {
    this.page = 1;
    this.getEmployees();
  }

  nextPage(): void {
    if (this.page < this.totalPage) {
      this.page++;
      this.getEmployees();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.getEmployees();
    }
  }
}

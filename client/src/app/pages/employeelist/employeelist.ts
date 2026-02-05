import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employeelist',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './employeelist.html',
})
export class Employeelist implements OnInit {

  apiUrl = 'http://localhost:8080';

  employees: any[] = [];

  searchText = '';
  page = 1;
  limit = 5;

  total = 0;
  totalPage = 1;

  loading = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // init โหลดทันที
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
      },
      error: (err) => {
        console.error(err);
        this.employees = [];
        this.total = 0;
        this.totalPage = 1;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // user search
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

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employeelist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employeelist.html',
})
export class EmployeelistComponent {
  employees = [
    { name: 'john', position: 'developer' },
    { name: 'anna', position: 'designer' },
  ];
}

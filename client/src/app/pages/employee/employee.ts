import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee.html',
})
export class EmployeeComponent {
  name = '';
  position = '';

  submit() {
    console.log(this.name, this.position);
  }
}

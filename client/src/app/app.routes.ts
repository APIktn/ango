import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { EmployeeComponent } from './pages/employee/employee';
import { Employeelist } from './pages/employeelist/employeelist';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'employee/new', component: EmployeeComponent },
  { path: 'employee/:emCode', component: EmployeeComponent },
  { path: 'employeelist', component: Employeelist },
];

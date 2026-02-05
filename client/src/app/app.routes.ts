import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { EmployeeComponent } from './pages/employee/employee';
import { EmployeelistComponent } from './pages/employeelist/employeelist';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: 'employeelist', component: EmployeelistComponent },
];

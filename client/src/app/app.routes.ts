import { Routes } from '@angular/router';
import { UserManagementComponent } from './components/user-management.component';
import { DashboardComponent } from './components/dashboard.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UserManagementComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
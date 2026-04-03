import { Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { DashboardLayoutComponent } from './components/dashboard-layout.component';
import { DashboardComponent } from './components/dashboard.component';
import { UserManagementComponent } from './components/user-management.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
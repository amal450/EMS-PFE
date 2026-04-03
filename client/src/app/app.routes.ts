import { Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { DashboardLayoutComponent } from './components/dashboard-layout.component';
import { DashboardComponent } from './components/dashboard.component';
import { UserManagementComponent } from './components/user-management.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile.component';

export const routes: Routes = [
  // Racine redirige vers login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login
  { path: 'login', component: LoginComponent },

  // Dashboard et ses enfants
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'profile', component: ProfileComponent },
      // Supprime cette ligne { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Toutes autres routes → login
  { path: '**', redirectTo: 'login' }
];
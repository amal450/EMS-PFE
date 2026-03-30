import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; // Vérifie bien le chemin

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' } // Si on arrive sur la racine, on va vers login
];

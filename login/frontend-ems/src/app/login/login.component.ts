import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- AJOUTE ÇA pour *ngIf
import { FormsModule } from '@angular/forms';   // <-- AJOUTE ÇA pour [(ngModel)]
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,           // C'est grâce à ça qu'Angular est rapide
  imports: [CommonModule, FormsModule], // <-- IL FAUT DÉCLARER LES OUTILS ICI
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  erreur = '';

  constructor(private auth: AuthService) {}

  connecter() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.access_token);
        alert('Bienvenue ' + res.user.username);
        // Ici tu pourras ajouter une redirection vers le dashboard plus tard
      },
      error: (err) => {
        this.erreur = 'Identifiants invalides ou erreur serveur';
        console.error(err);
      }
    });
  }
}
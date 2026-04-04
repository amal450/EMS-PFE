import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AssetStateService } from '../services/asset-state.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  public authService = inject(AuthService);
  public assetState = inject(AssetStateService);

  // --- Signals ---
  showLogoutModal = signal(false);
  activeButton: string = 'overview';

  ngOnInit() {
    // Synchroniser le bouton actif avec la route courante
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.url;
      if (url.includes('/dashboard')) {
        this.activeButton = 'overview';
      } else if (url.includes('/hierarchy')) {
        this.activeButton = 'hierarchy';
      } else if (url.includes('/users')) {
        this.activeButton = 'users';
      }
    });
  }

  navigateTo(route: string) {
    if (route === 'hierarchy') {
      this.router.navigate(['/hierarchy']);
    } else if (route === 'dashboard') {
      this.router.navigate(['/dashboard']);
    } else if (route === 'users') {
      this.router.navigate(['/users']);
    }
  }

  setActive(button: string) {
    this.activeButton = button;
  }

  confirmLogout() {
    this.showLogoutModal.set(false);
    this.logout();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
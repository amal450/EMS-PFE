import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { AuthService } from '../services/auth.service';
import { AssetStateService } from '../services/asset-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  template: `
    <div class="flex h-screen p-4 gap-6 overflow-hidden bg-slate-50">

      <app-sidebar class="h-full z-20"></app-sidebar>

      <div class="flex-1 flex flex-col gap-6 overflow-hidden">

        <header class="h-20 bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl flex items-center justify-between px-10 shadow-md">

          <div class="flex items-baseline gap-2">
            <h2 class="text-sm font-black text-blue-600 uppercase tracking-widest">
              {{ assetState.selectedAsset()?.name || 'Veuillez sélectionner un actif' }}
            </h2>
            <p class="text-[11px] text-slate-400 font-semibold uppercase">
              — {{ assetState.selectedAsset()?.type || 'Système' }}
            </p>
          </div>

          <div class="flex items-center gap-6" *ngIf="authService.currentUser$ | async as user">

            <div 
              (click)="navigateToProfile()"
              class="flex items-center gap-4 cursor-pointer hover:bg-slate-100 px-4 py-2 rounded-2xl transition"
            >
              <div class="text-right border-l border-slate-200 pl-6">
                <p class="text-xs font-black text-slate-800">{{ user.username }}</p>
                <p class="text-[9px] font-bold text-blue-600 uppercase">{{ user.role }}</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-slate-900 text-white font-black flex items-center justify-center">
                {{ (user.username || 'U').charAt(0).toUpperCase() }}
              </div>
            </div>

            <button 
              (click)="openLogoutModal()"
              class="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all">
              Déconnexion
            </button>

          </div>

        </header>

        <main class="flex-1 overflow-y-auto">
          <router-outlet></router-outlet>
        </main>

      </div>
    </div>

    <!-- Modal Confirmation Déconnexion -->
    <div *ngIf="showLogoutModal" class="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl w-96 p-6 shadow-2xl">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-2">Confirmer la déconnexion</h3>
          <p class="text-sm text-slate-500 mb-6">Êtes-vous sûr de vouloir vous déconnecter ?</p>
          <div class="flex gap-3">
            <button (click)="closeLogoutModal()" class="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition">
              Annuler
            </button>
            <button (click)="confirmLogout()" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition">
              Déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardLayoutComponent {

  public authService = inject(AuthService);
  public assetState = inject(AssetStateService);
  private router = inject(Router);

  showLogoutModal = false;

  openLogoutModal() {
    this.showLogoutModal = true;
  }

  closeLogoutModal() {
    this.showLogoutModal = false;
  }

  confirmLogout() {
    this.showLogoutModal = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
}
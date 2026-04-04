import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AssetStateService } from '../services/asset-state.service';

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
  hierarchy = signal<any[]>([]);
  showAssetModal = signal(false);
  isEditAssetMode = signal(false);
  showDeleteAssetModal = signal(false);
  assetForm = signal({ 
    id: null as number | null, 
    name: '', 
    type: 'EQUIPEMENT', 
    parentId: null as number | null 
  });
  assetToDeleteId: number | null = null;

  ngOnInit() {
    this.loadHierarchy();
  }

  loadHierarchy() {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    
    this.http.get<any[]>('http://localhost:3000/assets/tree', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: res => this.hierarchy.set(res),
      error: err => console.error('Erreur hiérarchie:', err)
    });
  }

  selectAsset(asset: any) {
    this.assetState.setAsset(asset);
    this.router.navigate(['/dashboard'], { queryParams: { id: asset.id } });
  }

  // --- CRUD HIERARCHY ---
  openAdd(parent: any, type: string) {
    this.isEditAssetMode.set(false);
    this.assetForm.set({ 
      id: null, 
      name: '', 
      type: type, 
      parentId: parent?.id || null 
    });
    this.showAssetModal.set(true);
  }

  openEdit(asset: any) {
    this.isEditAssetMode.set(true);
    this.assetForm.set({ 
      id: asset.id, 
      name: asset.name, 
      type: asset.type, 
      parentId: asset.parentId 
    });
    this.showAssetModal.set(true);
  }

  saveAsset() {
    const form = this.assetForm();
    const token = localStorage.getItem('auth_token');
    
    if (!form.name || !form.name.trim()) {
      console.error('Le nom est requis');
      return;
    }
    
    const options = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    if (this.isEditAssetMode()) {
      // Mode modification
      this.http.patch(`http://localhost:3000/assets/${form.id}`, form, options).subscribe({
        next: () => {
          this.loadHierarchy();
          this.showAssetModal.set(false);
          this.resetForm();
        },
        error: (err) => {
          console.error('Erreur lors de la modification:', err);
          alert('Erreur lors de la modification');
        }
      });
    } else {
      // Mode ajout
      this.http.post('http://localhost:3000/assets', form, options).subscribe({
        next: () => {
          this.loadHierarchy();
          this.showAssetModal.set(false);
          this.resetForm();
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout:', err);
          alert('Erreur lors de l\'ajout');
        }
      });
    }
  }
  
  resetForm() {
    this.assetForm.set({ 
      id: null, 
      name: '', 
      type: 'EQUIPEMENT', 
      parentId: null 
    });
  }

  askDelete(id: number) {
    this.assetToDeleteId = id;
    this.showDeleteAssetModal.set(true);
  }

  confirmDelete() {
    if (!this.assetToDeleteId) return;
    
    const token = localStorage.getItem('auth_token');
    this.http.delete(`http://localhost:3000/assets/${this.assetToDeleteId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.loadHierarchy();
        this.showDeleteAssetModal.set(false);
        this.assetToDeleteId = null;
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
        alert('Erreur lors de la suppression');
      }
    });
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  showLogoutModal = signal(false);
  confirmLogout() {
    this.showLogoutModal.set(false);
    this.logout();
  }
  activeButton: string = 'overview';

  setActive(button: string) {
   this.activeButton = button;
  }
  getAddButtonLabel(type: string): string {
  switch(type) {
    case 'SITE': return 'Ajouter site';
    case 'TGBT': return 'Ajouter TGBT';
    case 'ARMOIRE': return 'Ajouter armoire';
    case 'LIGNE': return 'Ajouter ligne';
    case 'EQUIPEMENT': return 'Ajouter équipement';
    default: return 'Ajouter asset';
  }
}
  
}
import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AssetStateService } from '../services/asset-state.service';

@Component({
  selector: 'app-hierarchy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hierarchy.component.html'
})
export class HierarchyComponent implements OnInit {
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
  assetToDeleteName = signal<string>('');

  ngOnInit() {
    this.loadHierarchy();
  }

  loadHierarchy() {
    const token = this.authService.getToken();
    if (!token) return;
    
    this.http.get<any[]>('http://localhost:3000/assets/tree', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: res => this.hierarchy.set(res),
      error: err => console.error('Erreur hiérarchie:', err)
    });
  }

  // MODIFIÉ : Naviguer vers dashboard avec l'asset sélectionné
  selectAsset(asset: any) {
    this.assetState.setAsset(asset);
    // Navigation vers dashboard avec le paramètre id
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
    const token = this.authService.getToken();
    
    if (!form.name || !form.name.trim()) {
      console.error('Le nom est requis');
      return;
    }
    
    const options = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    if (this.isEditAssetMode()) {
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

  askDelete(asset: any) {
    this.assetToDeleteId = asset.id;
    this.assetToDeleteName.set(asset.name);
    this.showDeleteAssetModal.set(true);
  }

  confirmDelete() {
    if (!this.assetToDeleteId) return;
    
    const token = this.authService.getToken();
    this.http.delete(`http://localhost:3000/assets/${this.assetToDeleteId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.loadHierarchy();
        this.showDeleteAssetModal.set(false);
        this.assetToDeleteId = null;
        this.assetToDeleteName.set('');
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
        alert('Erreur lors de la suppression');
      }
    });
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
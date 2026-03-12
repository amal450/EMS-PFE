import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  
  hierarchy = signal<any[]>([]);
  selectedId: number | null = null;
  currentUser = { username: 'Amal', role: 'ADMIN' }; 

  // Modals Add/Edit
  showAssetModal = false;
  isEditAssetMode = false;
  assetForm = { id: null as number | null, name: '', type: '', parentId: null as number | null };

  // Modal Delete
  showDeleteAssetModal = false;
  assetToDeleteId: number | null = null;

  ngOnInit() { this.loadHierarchy(); }

  loadHierarchy() {
    this.http.get<any[]>('http://localhost:3000/assets/tree').subscribe({
      next: (res) => this.hierarchy.set(res),
      error: () => console.log("Backend offline")
    });
  }

  // --- NAVIGATION ---
  onNavigate(path: string, id?: number) {
    if (id) {
      this.selectedId = id;
      this.router.navigate([path], { queryParams: { id: id } });
    } else {
      this.router.navigate([path]);
    }
  }

  selectAsset(asset: any) { this.onNavigate('dashboard', asset.id); }

  // --- CRUD HIERARCHY ---
  
  // Fonction bech tziid ay 7aja (TGBT, Armoire, Ligne, walla Equipement)
  openAddSubAsset(parent: any, type: string) {
    this.isEditAssetMode = false;
    this.assetForm = { id: null, name: '', type: type, parentId: parent ? parent.id : null };
    this.showAssetModal = true;
  }

  // Fonction bech t-modifier ay ka3ba (Site, Armoire, walla Ligne...)
  openEditAsset(asset: any) {
    this.isEditAssetMode = true;
    this.assetForm = { id: asset.id, name: asset.name, type: asset.type, parentId: asset.parentId };
    this.showAssetModal = true;
  }

  saveAsset() {
    if (this.isEditAssetMode) {
      this.http.patch(`http://localhost:3000/assets/${this.assetForm.id}`, this.assetForm)
        .subscribe(() => { this.loadHierarchy(); this.showAssetModal = false; });
    } else {
      const { id, ...data } = this.assetForm;
      this.http.post('http://localhost:3000/assets', data)
        .subscribe(() => { this.loadHierarchy(); this.showAssetModal = false; });
    }
  }

  // Confirmation Delete
  askDeleteAsset(id: number) {
    this.assetToDeleteId = id;
    this.showDeleteAssetModal = true;
  }

  confirmDeleteAsset() {
    if (this.assetToDeleteId) {
      this.http.delete(`http://localhost:3000/assets/${this.assetToDeleteId}`).subscribe(() => {
        this.loadHierarchy();
        this.showDeleteAssetModal = false;
        this.router.navigate(['/dashboard']);
      });
    }
  }
}
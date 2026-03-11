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
  
  // --- البيانات الأساسية ---
  hierarchy = signal<any[]>([]);
  selectedId: number | null = null;
  currentUser = { username: 'Amal', role: 'ADMIN' }; 

  // --- التحكم في المودال (Add/Edit) ---
  showAssetModal = false;
  isEditAssetMode = false;
  assetForm = { id: null as number | null, name: '', type: 'SITE', parentId: null as number | null };

  // --- التحكم في مودال الحذف (Delete Modal) ---
  showDeleteAssetModal = false;
  assetToDeleteId: number | null = null;

  ngOnInit() {
    this.loadHierarchy();
  }

  loadHierarchy() {
    this.http.get<any[]>('http://localhost:3000/assets/tree').subscribe({
      next: (res) => this.hierarchy.set(res),
      error: () => console.log("Backend offline")
    });
  }

  onNavigate(path: string, id?: number) {
    if (id) {
      this.selectedId = id;
      this.router.navigate([path], { queryParams: { id: id } });
    } else {
      this.router.navigate([path]);
    }
  }

  selectAsset(asset: any) {
    this.onNavigate('dashboard', asset.id);
  }

  // --- HIERARCHY CRUD ---
  
  openAddSite() {
    this.isEditAssetMode = false;
    this.assetForm = { id: null, name: '', type: 'SITE', parentId: null };
    this.showAssetModal = true;
  }

  addTGBT(parentId: number) {
    this.isEditAssetMode = false;
    this.assetForm = { id: null, name: '', type: 'TGBT', parentId: parentId };
    this.showAssetModal = true;
  }

  editAsset(asset: any) {
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

  // --- CUSTOM DELETE LOGIC ---
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
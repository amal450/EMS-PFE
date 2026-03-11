import { Component, signal, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent implements OnInit {
  private http = inject(HttpClient);
  users = signal<any[]>([]);
  
  showModal = false;
  showDeleteModal = false;
  isEditMode = false;
  passwordVisible = false;
  userToDeleteId: number | null = null;
  visiblePasswords: { [key: number]: boolean } = {};
  userForm = { id: null, username: '', email: '', password: '', role: 'UTILISATEUR' };

  ngOnInit() { this.fetchUsers(); }

  fetchUsers() {
    this.http.get<any[]>('http://localhost:3000/users').subscribe(res => this.users.set(res));
  }

  togglePassword(id: number) { this.visiblePasswords[id] = !this.visiblePasswords[id]; }

  openAddModal() {
    this.isEditMode = false;
    this.userForm = { id: null, username: '', email: '', password: '', role: 'UTILISATEUR' };
    this.showModal = true;
  }

  openEditModal(user: any) {
    this.isEditMode = true;
    this.userForm = { ...user };
    this.showModal = true;
  }

  saveUser() {
    if (this.isEditMode) {
      this.http.patch(`http://localhost:3000/users/${this.userForm.id}`, this.userForm).subscribe(() => { this.fetchUsers(); this.showModal = false; });
    } else {
      const { id, ...data } = this.userForm;
      this.http.post('http://localhost:3000/users', data).subscribe(() => { this.fetchUsers(); this.showModal = false; });
    }
  }

  askDelete(id: number) { this.userToDeleteId = id; this.showDeleteModal = true; }

  confirmDelete() {
    if (this.userToDeleteId) {
      this.http.delete(`http://localhost:3000/users/${this.userToDeleteId}`).subscribe(() => { this.fetchUsers(); this.showDeleteModal = false; });
    }
  }
}
import { Component, signal, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);
  users = signal<any[]>([]);
  
  // Modals Visibility
  showModal = false;
  showDeleteModal = false;
  isEditMode = false;
  passwordVisible = false;
  visiblePasswords: { [key: number]: boolean } = {};

  togglePassword(id: number) {
    this.visiblePasswords[id] = !this.visiblePasswords[id];
  } // رؤية الباسورد
  
  userToDeleteId: number | null = null;
  userForm = { id: null, username: '', email: '', password: '', role: 'UTILISATEUR' };

  ngOnInit() { this.fetchUsers(); }

  fetchUsers() {
    this.http.get<any[]>('http://localhost:3000/users').subscribe(res => this.users.set(res));
  }

  openAddModal() {
    this.isEditMode = false;
    this.passwordVisible = false;
    this.userForm = { id: null, username: '', email: '', password: '', role: 'UTILISATEUR' };    this.showModal = true;
  }

  openEditModal(user: any) {
    this.isEditMode = true;
    this.passwordVisible = false;
    this.userForm = { ...user, password: '' }; 
    this.showModal = true;
  }

  saveUser() {
    if (this.isEditMode) {
      this.http.patch(`http://localhost:3000/users/${this.userForm.id}`, this.userForm)
        .subscribe(() => { this.fetchUsers(); this.showModal = false; });
    } else {
      const { id, ...newUserData } = this.userForm;
      this.http.post('http://localhost:3000/users', newUserData)
        .subscribe(() => { this.fetchUsers(); this.showModal = false; });
    }
  }

  // فنكشن المسح الجديدة (تفتح المودال فقط)
  askDelete(id: number) {
    this.userToDeleteId = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.userToDeleteId) {
      this.http.delete(`http://localhost:3000/users/${this.userToDeleteId}`).subscribe(() => {
        this.fetchUsers();
        this.showDeleteModal = false;
      });
    }
  }
}
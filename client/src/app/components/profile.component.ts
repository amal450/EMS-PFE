import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html' // تأكدي من وجود ملف الـ html اللي عطيتهولك
})
export class ProfileComponent {
  currentUser = { username: 'Amal Dawed', email: 'dawad0545@gmail.com' };
  updateProfile() { alert('Profil mis à jour !'); }
}
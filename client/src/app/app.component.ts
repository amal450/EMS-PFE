import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private router = inject(Router);

  // الدالة اللي تخلّي الـ Top Nav يخدم
  navigate(path: string) {
    this.router.navigate([path]);
  }
}
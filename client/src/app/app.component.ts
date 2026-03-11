import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent], // نزيدو الـ Sidebar هوني باش تظهر
  templateUrl: './app.component.html',
})
export class AppComponent {}
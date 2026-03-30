import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // <-- DOIT ÊTRE LÀ

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // <-- DOIT ÊTRE DÉCLARÉ ICI
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'frontend-ems';
}
import { Component, signal, OnInit, inject, OnDestroy, NgZone } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private zone = inject(NgZone);
  public authService = inject(AuthService);

  selectedAsset: any = null;
  private monitorInterval: any;

  // Signal pour les mesures en live
  liveData = signal({ 
    power: '0.00', 
    i1: '0.0', i2: '0.0', i3: '0.0', 
    v1: '000', v2: '000', v3: '000', 
    u1: '000', u2: '000', u3: '000',
    frequency: '50.00',
    cosPhi: '0.00',
    timestamp: new Date()
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = Number(params['id']);
      if (id && !isNaN(id)) {
        this.zone.run(() => {
          this.resetLiveData();
          this.fetchAssetDetails(id);
          this.startMonitoring(id);
        });
      }
    });
  }

  private resetLiveData() {
    this.zone.run(() => {
      this.liveData.set({ 
        power: '0.00', i1: '0.0', i2: '0.0', i3: '0.0', 
        v1: '000', v2: '000', v3: '000', 
        u1: '000', u2: '000', u3: '000',
        frequency: '00.00', cosPhi: '0.00', 
        timestamp: new Date() 
      });
    });
  }

  fetchAssetDetails(id: number) {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token manquant !');
      return;
    }

    this.http.get<any>(`http://localhost:3000/assets/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: (res) => this.zone.run(() => this.selectedAsset = res),
      error: (err) => {
        console.error('Erreur fetching asset:', err);
        this.zone.run(() => this.selectedAsset = null);
      }
    });
  }

  startMonitoring(id: number) {
    if (this.monitorInterval) clearInterval(this.monitorInterval);

    this.monitorInterval = setInterval(() => {
      const token = this.authService.getToken();
      if (!token) {
        console.warn('Token manquant, monitoring stoppé.');
        return;
      }

      this.http.get<any>(`http://localhost:3000/measurements/latest/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).subscribe({
        next: (res) => {
          this.zone.run(() => {
            if (res) {
              this.liveData.set(res);
            } else {
              this.resetLiveData();
            }
          });
        },
        error: (err) => {
          this.zone.run(() => this.resetLiveData());
          if (err.status === 401) {
            console.error('401 Unauthorized – vérifie ton token ou login');
          } else {
            console.warn('Attente données du simulateur...', err);
          }
        }
      });
    }, 1000);
  }

  ngOnDestroy() {
    if (this.monitorInterval) clearInterval(this.monitorInterval);
  }
}
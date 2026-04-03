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

  liveData = signal({ 
    V1N: '000', V2N: '000', V3N: '000', 
    V12: '000', V23: '000', V31: '000',
    I1: '0.0', I2: '0.0', I3: '0.0', 
    TKW: '0.00', 
    IKWH: '0.00', 
    HZ: '00.00',
    PF: '0.00',
    KVAH: '0.00',
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
        V1N: '000', V2N: '000', V3N: '000', 
        V12: '000', V23: '000', V31: '000',
        I1: '0.0', I2: '0.0', I3: '0.0', 
        TKW: '0.00', IKWH: '0.00', HZ: '00.00', PF: '0.00', KVAH: '0.00',
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
              // Utilisation DIRECTE des majuscules retournées par le service
              this.liveData.set({
                V1N: res.V1N || '000',
                V2N: res.V2N || '000',
                V3N: res.V3N || '000',
                V12: res.V12 || '000',
                V23: res.V23 || '000',
                V31: res.V31 || '000',
                I1: res.I1 || '0.0',
                I2: res.I2 || '0.0',
                I3: res.I3 || '0.0',
                TKW: res.TKW || '0.00',
                IKWH: res.IKWH || '0.00',
                KVAH: res.KVAH || '0.00',
                HZ: res.HZ || '00.00',
                PF: res.PF || '0.00',
                timestamp: res.timestamp || new Date()
              });
              
              console.log('✅ Données reçues:', {
                V1N: res.V1N, V2N: res.V2N, V3N: res.V3N,
                I1: res.I1, I2: res.I2, I3: res.I3,
                TKW: res.TKW, PF: res.PF, HZ: res.HZ
              });
            } else {
              this.resetLiveData();
            }
          });
        },
        error: (err) => {
          console.log('⏳ En attente des données du simulateur...');
          this.zone.run(() => this.resetLiveData());
          if (err.status === 401) {
            console.error('401 Unauthorized – vérifie ton token ou login');
          }
        }
      });
    }, 2000);
  }

  ngOnDestroy() {
    if (this.monitorInterval) clearInterval(this.monitorInterval);
  }
}
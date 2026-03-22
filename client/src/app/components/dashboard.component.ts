import { Component, signal, OnInit, inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  
  selectedAsset: any = null;
  private monitorInterval: any;

  // التحديث هوني: زدنا frequency و cosPhi للـ Signal
  // src/app/components/dashboard.component.ts

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
      // 1. أهم خطوة: تصفير الأرقام فوراً عند الضغط على عنصر جديد
      this.liveData.set({ 
        power: '0.00', i1: '0.0', i2: '0.0', i3: '0.0', 
        v1: '000', v2: '000', v3: '000', u1: '000', u2: '000', u3: '000',
        frequency: '00.00', cosPhi: '0.00', timestamp: new Date() 
      });

      this.fetchAssetDetails(id);
      
      if (this.monitorInterval) clearInterval(this.monitorInterval);
      this.monitorInterval = setInterval(() => {
        this.http.get<any>(`http://localhost:3000/measurements/latest/${id}`).subscribe({
          next: (res) => {
            // 2. إذا فما داتا نحطوها، إذا السرفر رجع null (يعني المعدة فارغة) نخليوها أصفار
            if (res) {
              this.liveData.set(res);
            } else {
              this.liveData.set({ 
                power: '0.00', i1: '0.0', i2: '0.0', i3: '0.0', 
                v1: '000', v2: '000', v3: '000', u1: '000', u2: '000', u3: '000',
                frequency: '00.00', cosPhi: '0.00', timestamp: new Date() 
              });
            }
          }
        });
      }, 1000);
    }
  });
}

  fetchAssetDetails(id: number) {
    this.http.get<any>(`http://localhost:3000/assets/${id}`).subscribe(res => {
      this.selectedAsset = res;
    });
  }

  startMonitoring(id: number) {
    if (this.monitorInterval) clearInterval(this.monitorInterval);
    this.monitorInterval = setInterval(() => {
      this.http.get<any>(`http://localhost:3000/measurements/latest/${id}`).subscribe({
        next: (res) => { if (res) this.liveData.set(res); },
        error: () => console.log("Attente données du simulateur...")
      });
    }, 1000);
  }

  ngOnDestroy() {
    if (this.monitorInterval) clearInterval(this.monitorInterval);
  }
}
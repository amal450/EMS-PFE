import { Component, signal, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  
  selectedAsset: any = null; 
  liveData = signal({ power: '0.00', voltage: '000', intensity: '0.0' });

  // src/app/components/dashboard.component.ts

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    const id = Number(params['id']);
    if (id && !isNaN(id)) {
      this.fetchAssetDetails(id);
      
      // STOP any old interval before starting new one
      if (this.monitorInterval) clearInterval(this.monitorInterval);

      this.monitorInterval = setInterval(() => {
        this.http.get<any>(`http://localhost:3000/measurements/latest/${id}`).subscribe(res => {
          if (res) this.liveData.set(res);
        });
      }, 1000);
    }
  });
}
private monitorInterval: any;

fetchAssetDetails(id: number) {
  this.http.get<any>(`http://localhost:3000/assets/${id}`).subscribe(res => {
    this.selectedAsset = res;
  });
}

startMonitoring(id: number) {
  setInterval(() => {
    this.http.get<any>(`http://localhost:3000/measurements/latest/${id}`).subscribe({
      next: (res) => { if(res) this.liveData.set(res); }
    });
  }, 1000);
}
}
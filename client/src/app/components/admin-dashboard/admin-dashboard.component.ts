import { Component, OnInit } from '@angular/core';
import { MaintenanceRequest } from 'src/app/models/maintenance-request.model';
import { MaintenanceService } from 'src/app/services/maintenance.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  maintenanceRequests: MaintenanceRequest[] = [];
  loading = false;
  errorMessage = '';

  constructor(private maintenanceService: MaintenanceService) { }

  ngOnInit(): void {
    this.loadMaintenanceRequests();
  }

  loadMaintenanceRequests() {
    this.loading = true;
    this.maintenanceService.getOpenMaintenanceRequests().subscribe(
      (requests) => {
        this.maintenanceRequests = requests;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching maintenance requests', error);
        this.errorMessage = 'Failed to load maintenance requests. Please try again.';
        this.loading = false;
      }
    );
  }

  closeRequest(id: string) {
    this.maintenanceService.closeMaintenanceRequest(id).subscribe(
      () => {
        this.maintenanceRequests = this.maintenanceRequests.filter(request => request.id !== id);
      },
      (error) => {
        console.error('Error closing maintenance request', error);
        this.errorMessage = 'Failed to close maintenance request. Please try again.';
      }
    );
  }

}

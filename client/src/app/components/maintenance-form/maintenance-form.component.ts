import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceType } from 'src/app/models/maintenance-request.model';
import { MaintenanceService } from 'src/app/services/maintenance.service';

@Component({
  selector: 'app-maintenance-form',
  templateUrl: './maintenance-form.component.html',
  styleUrls: ['./maintenance-form.component.scss'],
})
export class MaintenanceFormComponent implements OnInit {
  maintenanceForm!: FormGroup;
  serviceTypes = Object.values(ServiceType);
  submitted = false;
  submitSuccess = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private maintenanceService: MaintenanceService
  ) {}

  ngOnInit(): void {
    this.maintenanceForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      unitNumber: ['', Validators.required],
      serviceType: ['', Validators.required],
      summary: ['', Validators.required],
      details: [''],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.submitSuccess = false;
    this.errorMessage = '';

    if (this.maintenanceForm.valid) {
      this.maintenanceService
        .createMaintenanceRequest(this.maintenanceForm.value)
        .subscribe(
          (response) => {
            console.log('Maintenance request submitted successfully', response);
            this.submitSuccess = true;
            this.maintenanceForm.reset();
            this.submitted = false;
            this.closeAlerts();
          },
          (error) => {
            console.error('Error submitting maintenance request', error);
            this.errorMessage =
              'An error occurred while submitting your request. Please try again.';
          }
        );
    }
  }

  // closing alerts after 3sec
  closeAlerts() {
    setTimeout(() => {
      this.submitSuccess = false;
      this.errorMessage = '';
    }, 3000);
  }

  get f() {
    return this.maintenanceForm.controls;
  }
}

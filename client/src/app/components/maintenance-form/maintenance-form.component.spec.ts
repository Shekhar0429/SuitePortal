import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { MaintenanceFormComponent } from './maintenance-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ServiceType } from 'src/app/models/maintenance-request.model';
import { MaintenanceService } from 'src/app/services/maintenance.service';

describe('MaintenanceFormComponent', () => {
  let component: MaintenanceFormComponent;
  let fixture: ComponentFixture<MaintenanceFormComponent>;
  let maintenanceServiceMock: jest.Mocked<MaintenanceService>;

  beforeEach(async () => {
    maintenanceServiceMock = {
      createMaintenanceRequest: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [ MaintenanceFormComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: MaintenanceService, useValue: maintenanceServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.maintenanceForm).toBeDefined();
    expect(component.maintenanceForm.get('name')?.value).toBe('');
    expect(component.maintenanceForm.get('email')?.value).toBe('');
    expect(component.maintenanceForm.get('unitNumber')?.value).toBe('');
    expect(component.maintenanceForm.get('serviceType')?.value).toBe('');
    expect(component.maintenanceForm.get('summary')?.value).toBe('');
    expect(component.maintenanceForm.get('details')?.value).toBe('');
  });

  it('should populate serviceTypes with all ServiceType values', () => {
    expect(component.serviceTypes).toEqual(Object.values(ServiceType));
  });

  it('should mark form as invalid when empty', () => {
    expect(component.maintenanceForm.valid).toBeFalsy();
  });

  it('should mark form as valid when all required fields are filled', () => {
    component.maintenanceForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      unitNumber: '101',
      serviceType: ServiceType.Plumbing,
      summary: 'Leaky faucet'
    });
    expect(component.maintenanceForm.valid).toBeTruthy();
  });

  it('should mark email as invalid when incorrectly formatted', () => {
    const emailControl = component.maintenanceForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.hasError('email')).toBeTruthy();
  });

  it('should handle error when form submission fails', fakeAsync(() => {
    maintenanceServiceMock.createMaintenanceRequest.mockReturnValue(throwError('Error'));

    component.maintenanceForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      unitNumber: '101',
      serviceType: ServiceType.Plumbing,
      summary: 'Leaky faucet'
    });

    component.onSubmit();
    tick();

    expect(maintenanceServiceMock.createMaintenanceRequest).toHaveBeenCalledWith(component.maintenanceForm.value);
    expect(component.submitSuccess).toBeFalsy();
    expect(component.errorMessage).toBe('An error occurred while submitting your request. Please try again.');
  }));

  it('should close alerts after 3 seconds', fakeAsync(() => {
    component.submitSuccess = true;
    component.errorMessage = 'Test error';

    component.closeAlerts();
    tick(3000);

    expect(component.submitSuccess).toBeFalsy();
    expect(component.errorMessage).toBe('');
  }));
});

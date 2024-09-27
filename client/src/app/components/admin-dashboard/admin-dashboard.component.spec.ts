import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import { MaintenanceRequest, ServiceType } from 'src/app/models/maintenance-request.model';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let maintenanceServiceMock: jest.Mocked<MaintenanceService>;

  const mockRequests: MaintenanceRequest[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', unitNumber: '101', serviceType: ServiceType.Plumbing, summary: 'Leaky faucet', status: 'open', createdAt: new Date() },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', unitNumber: '202', serviceType: ServiceType.Electrical, summary: 'Power outage', status: 'open', createdAt: new Date() }
  ];

  beforeEach(async () => {
    maintenanceServiceMock = {
      getOpenMaintenanceRequests: jest.fn(),
      closeMaintenanceRequest: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardComponent ],
      providers: [
        { provide: MaintenanceService, useValue: maintenanceServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load maintenance requests on init', fakeAsync(() => {
    maintenanceServiceMock.getOpenMaintenanceRequests.mockReturnValue(of(mockRequests));

    fixture.detectChanges(); // This triggers ngOnInit
    tick();

    expect(component.maintenanceRequests).toEqual(mockRequests);
    expect(component.loading).toBeFalsy();
    expect(component.errorMessage).toBe('');
  }));

  it('should handle error when loading maintenance requests fails', fakeAsync(() => {
    maintenanceServiceMock.getOpenMaintenanceRequests.mockReturnValue(throwError('Error'));

    fixture.detectChanges(); // This triggers ngOnInit
    tick();

    expect(component.maintenanceRequests).toEqual([]);
    expect(component.loading).toBeFalsy();
    expect(component.errorMessage).toBe('Failed to load maintenance requests. Please try again.');
  }));

  it('should handle error when closing a maintenance request fails', fakeAsync(() => {
    component.maintenanceRequests = [...mockRequests];
    maintenanceServiceMock.closeMaintenanceRequest.mockReturnValue(throwError('Error'));

    component.closeRequest('1');
    tick();

    expect(component.maintenanceRequests.length).toBe(2);
    expect(component.errorMessage).toBe('Failed to close maintenance request. Please try again.');
  }));

  it('should set loading to true when fetching requests', fakeAsync(() => {
    maintenanceServiceMock.getOpenMaintenanceRequests.mockReturnValue(of(mockRequests));

    component.loadMaintenanceRequests();

    expect(component.loading).toBeTruthy();

    tick();

    expect(component.loading).toBeFalsy();
  }));

  it('should log error to console when fetching requests fails', fakeAsync(() => {
    const consoleErrorSpy = jest.spyOn(console, 'error');
    maintenanceServiceMock.getOpenMaintenanceRequests.mockReturnValue(throwError('Test error'));

    component.loadMaintenanceRequests();
    tick();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching maintenance requests', 'Test error');

    consoleErrorSpy.mockRestore();
  }));

  it('should log error to console when closing request fails', fakeAsync(() => {
    const consoleErrorSpy = jest.spyOn(console, 'error');
    maintenanceServiceMock.closeMaintenanceRequest.mockReturnValue(throwError('Test error'));

    component.closeRequest('1');
    tick();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error closing maintenance request', 'Test error');

    consoleErrorSpy.mockRestore();
  }));
});
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AdminLoginComponent } from './admin-login.component';
import { AdminService } from 'src/app/services/admin.service';

describe('AdminLoginComponent', () => {
  let component: AdminLoginComponent;
  let fixture: ComponentFixture<AdminLoginComponent>;
  let adminServiceMock: jest.Mocked<AdminService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    adminServiceMock = {
      login: jest.fn()
    } as any;

    routerMock = {
      navigate: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [ AdminLoginComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: AdminService, useValue: adminServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should mark form as valid when all fields are filled', () => {
    component.loginForm.patchValue({
      username: 'admin',
      password: 'password123'
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call login service and navigate to dashboard on successful login', fakeAsync(() => {
    const mockResponse = { token: 'fake-token' };
    adminServiceMock.login.mockReturnValue(of(mockResponse));

    component.loginForm.patchValue({
      username: 'admin',
      password: 'password123'
    });

    component.onSubmit();
    tick();

    expect(adminServiceMock.login).toHaveBeenCalledWith('admin', 'password123');
    expect(localStorage.getItem('adminToken')).toBe('fake-token');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
  }));

  it('should set error message on login failure', fakeAsync(() => {
    adminServiceMock.login.mockReturnValue(throwError('Error'));

    component.loginForm.patchValue({
      username: 'admin',
      password: 'wrong-password'
    });

    component.onSubmit();
    tick();

    expect(adminServiceMock.login).toHaveBeenCalledWith('admin', 'wrong-password');
    expect(component.errorMessage).toBe('Invalid username or password');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  }));

  it('should not call login service if form is invalid', fakeAsync(() => {
    component.loginForm.patchValue({
      username: 'admin',
      password: ''
    });

    component.onSubmit();
    tick();

    expect(adminServiceMock.login).not.toHaveBeenCalled();
    expect(component.submitted).toBeTruthy();
  }));

  it('should provide access to form controls via getter', () => {
    expect(component.f).toBe(component.loginForm.controls);
  });

  // Test to check if localStorage is cleared before setting new token
  it('should clear existing token before setting new one', fakeAsync(() => {
    localStorage.setItem('adminToken', 'old-token');
    const mockResponse = { token: 'new-token' };
    adminServiceMock.login.mockReturnValue(of(mockResponse));

    component.loginForm.patchValue({
      username: 'admin',
      password: 'password123'
    });

    component.onSubmit();
    tick();

    expect(localStorage.getItem('adminToken')).toBe('new-token');
  }));

  // Test to check if console.log and console.error are called
  it('should log success and errors appropriately', fakeAsync(() => {
    const consoleLogSpy = jest.spyOn(console, 'log');
    const consoleErrorSpy = jest.spyOn(console, 'error');

    // Test successful login
    const mockResponse = { token: 'fake-token' };
    adminServiceMock.login.mockReturnValue(of(mockResponse));

    component.loginForm.patchValue({
      username: 'admin',
      password: 'password123'
    });

    component.onSubmit();
    tick();

    expect(consoleLogSpy).toHaveBeenCalledWith('Login successful', mockResponse);

    // Test failed login
    adminServiceMock.login.mockReturnValue(throwError('Error'));

    component.onSubmit();
    tick();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Login failed', 'Error');

    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  }));
});
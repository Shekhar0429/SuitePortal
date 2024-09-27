import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.adminService.login(username, password).subscribe(
        (response) => {
          console.log('Login successful', response);
          localStorage.setItem('adminToken', response.token); // storing token in local storage
          this.router.navigate(['/admin/dashboard']);
        },
        (error) => {
          console.error('Login failed', error);
          this.errorMessage = 'Invalid username or password';
        }
      );
    }
  }

  // Getter for easy access to form fields
  get f() { return this.loginForm.controls; }
}

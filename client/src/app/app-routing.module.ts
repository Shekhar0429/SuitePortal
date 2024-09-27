import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { MaintenanceFormComponent } from './components/maintenance-form/maintenance-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/maintenance', pathMatch: 'full' },
  { path: 'maintenance', component: MaintenanceFormComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
  },
  { path: '**', redirectTo: '/maintenance' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

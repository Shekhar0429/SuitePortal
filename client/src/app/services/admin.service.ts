import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.url;
const adminUrl = `${API_URL}/api/admin`;

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  // API call for admin login
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${adminUrl}/login`, { username, password });
  }
}

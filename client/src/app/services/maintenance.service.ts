import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MaintenanceRequest } from '../models/maintenance-request.model';
import { environment } from 'src/environments/environment';

const API_URL = environment.url;
const maintenanceUrl = `${API_URL}/api/maintenance-requests`;


@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {
  constructor(private http: HttpClient) {}

  // API call for adding new request
  createMaintenanceRequest(
    request: MaintenanceRequest
  ): Observable<MaintenanceRequest> {
    return this.http.post<MaintenanceRequest>(maintenanceUrl, request).pipe(
      tap((createdRequest) =>
        console.log('Created maintenance request:', createdRequest)
      ),
      catchError(
        this.handleError<MaintenanceRequest>('createMaintenanceRequest')
      )
    );
  }

  // API call to get all open request.
  getOpenMaintenanceRequests(): Observable<MaintenanceRequest[]> {
    return this.http.get<MaintenanceRequest[]>(maintenanceUrl).pipe(
      tap((requests) =>
        console.log('Fetched open maintenance requests:', requests)
      ),
      catchError(
        this.handleError<MaintenanceRequest[]>('getOpenMaintenanceRequests', [])
      )
    );
  }

  // API call to close a request
  closeMaintenanceRequest(id: string): Observable<MaintenanceRequest> {
    return this.http
      .put<MaintenanceRequest>(`${maintenanceUrl}/${id}/close`, {})
      .pipe(
        tap((closedRequest) =>
          console.log('Closed maintenance request:', closedRequest)
        ),
        catchError(
          this.handleError<MaintenanceRequest>('closeMaintenanceRequest')
        )
      );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      throw error;
    };
  }
}

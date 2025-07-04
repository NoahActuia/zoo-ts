import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, map, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private backendUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getAuthHeaders(): Observable<HttpHeaders> {
    return this.auth.getAccessTokenSilently().pipe(
      tap((token) => console.log('🔑 Token obtenu')),
      map((token) => new HttpHeaders().set('Authorization', `Bearer ${token}`)),
      tap((headers) => console.log('📨 Headers préparés:', headers))
    );
  }

  get<T>(endpoint: string): Observable<T> {
    console.log(`🌐 GET ${endpoint}`);
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<T>(`${this.backendUrl}${endpoint}`, { headers })
      ),
      tap({
        next: (response) => console.log(`✅ GET ${endpoint} réussi:`, response),
        error: (error) => console.error(`❌ GET ${endpoint} échoué:`, error),
      })
    );
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    console.log(`🌐 POST ${endpoint}`, data);
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<T>(`${this.backendUrl}${endpoint}`, data, { headers })
      ),
      tap({
        next: (response) =>
          console.log(`✅ POST ${endpoint} réussi:`, response),
        error: (error) => console.error(`❌ POST ${endpoint} échoué:`, error),
      })
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    console.log(`🌐 DELETE ${endpoint}`);
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.delete<T>(`${this.backendUrl}${endpoint}`, { headers })
      ),
      tap({
        next: (response) =>
          console.log(`✅ DELETE ${endpoint} réussi:`, response),
        error: (error) => console.error(`❌ DELETE ${endpoint} échoué:`, error),
      })
    );
  }
}

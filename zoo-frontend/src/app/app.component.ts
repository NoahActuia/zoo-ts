import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  username: string | undefined;
  backendUrl = 'http://localhost:3000';

  constructor(
    public auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      console.log('👤 User:', user);
      this.username = user?.name;
    });
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  testCallApi() {
    this.auth.getAccessTokenSilently().subscribe((token) => {
      console.log('🔑 Access Token:', token);

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.get(`${this.backendUrl}/animaux/1`, { headers }).subscribe({
        next: (data) => {
          console.log('🐾 Réponse API:', data);
        },
        error: (error) => {
          console.error('❌ Erreur API:', error);
        },
      });
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth'; // adapte si besoin
  private tokenKey = 'token';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  // ================= AUTH =================
  login(credentials: any): Observable<any> {
    return this.http.post('http://localhost:8081/auth/login', credentials);
  }

  
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  // ================= JWT DATA =================

  getUserRole(): string {
    const token = this.getToken();
    if (!token) return '';
    return this.jwtHelper.decodeToken(token)?.role || '';
  }

  getNom(): string {
    const token = this.getToken();
    if (!token) return '';
    return this.jwtHelper.decodeToken(token)?.nom || '';
  }

  getPrenom(): string {
    const token = this.getToken();
    if (!token) return '';
    return this.jwtHelper.decodeToken(token)?.prenom || '';
  }

  getUserName(): string {
    return `${this.getNom()} ${this.getPrenom()}`.trim();
  }


  // Ajoutons la méthode register pour ton futur test
  register(userData: any): Observable<any> {
    return this.http.post('http://localhost:8081/user/register', userData);
  }
}

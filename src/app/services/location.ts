import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, Ville } from './ClientsService';


export interface Region {
  id: number;
  label: string;
  villes: Ville[];
}


@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = 'http://localhost:8081/region'; // Ajuste l'URL selon ton controller

  constructor(private http: HttpClient) {}

  // Récupère toutes les régions avec leurs villes incluses
  getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(this.apiUrl);
  }
}

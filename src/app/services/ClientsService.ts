import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../layouts/client-layout/shared/models/Product';



export interface Client {
  id: number;
  nom: string;
  prenom: string;
  date_naissance: string;
  phone: string;
  image?: string;
  email: string;
  active: boolean;
  role: Role;
  ville: Ville;
}


export interface Role {
  id: number;
  name: string;
}

export interface Ville {
  id: number;
  label: string;
  code_postal: number;
}


export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}



@Injectable({ providedIn: 'root' })
export class ClientsService {


  private apiUrl = 'http://localhost:8081/user';

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<Client[]> {
    console.log("all clients : " , this.apiUrl);
    return this.http.get<Client[]>(this.apiUrl);
  }


  deleteClient(clientId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${clientId}`);
  }


}


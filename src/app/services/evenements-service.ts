import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from './ClientsService';
import { Observable } from 'rxjs';



export interface Evenement {
  id: number;
  date_debut : Date;
  date_fin : Date,
  label: String;
  dons : any
}

@Injectable({
  providedIn: 'root',
})
export class EvenementsService {

  private apiUrl = 'http://localhost:8081/evenements';

  constructor(private http: HttpClient) {}

  getAllEvenements(): Observable<ApiResponse<Evenement[]>> {
    console.log("all prods : " , this.apiUrl);

    return this.http.get<ApiResponse<Evenement[]>>(this.apiUrl);
  }


   getEvenemntById(evenementsId: number): Observable<any[]> {
    console.log(`getEvenementsById : ${this.apiUrl}/getEvenementsById/${evenementsId}`);

    return this.http.get<any[]>(`${this.apiUrl}/getEvenementsById/${evenementsId}`);
  }

  deleteEvenement(evenementId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${evenementId}`);
  }


  updateEvenement(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }


  saveEvenement(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

}

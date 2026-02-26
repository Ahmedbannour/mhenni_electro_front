import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Categorie } from '../../../models/Categorie';



@Injectable({ providedIn: 'root' })
export class CategorieService {
  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Categorie[]> {
    console.log('0');
    return this.http.get<any>('http://localhost:8081/categories').pipe(
      map(response => {
        console.log("dataa  : ", response.data);

        return response.data as Categorie[];
      }) // On extrait "data" de ton ApiResponse
    );
  }
}


@Component({
  selector: 'app-categories',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})


export class Categories implements OnInit {
  categoriesList: Categorie[] = [];

  constructor(private categorieService: CategorieService) {}

  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.categorieService.getAllCategories().subscribe({
      next: (response: any) => {
        // Ton JSON a une structure { status, message, data: [...] }
        const allData = response as Categorie[];

        console.log("data : " , allData);

        this.categoriesList = allData.filter(cat => cat.parent === null);

        console.log('Catégories filtrées :', this.categoriesList);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des catégories', err);
      }
    });
  }
}

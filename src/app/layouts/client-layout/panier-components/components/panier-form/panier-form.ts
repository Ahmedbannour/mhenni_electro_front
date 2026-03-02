import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { CartService } from '../../../../../services/cart';

@Component({
  selector: 'app-panier-form',
  standalone: true,
  imports: [CommonModule, AsyncPipe, DecimalPipe],
  templateUrl: './panier-form.html',
  styleUrl: './panier-form.css'
})

export class PanierForm {
  public cartService = inject(CartService);
  private http = inject(HttpClient);
  private router = inject(Router);

  onCheckout() {
    // 1. On récupère la valeur actuelle du panier de manière synchrone et propre
    this.cartService.items$.pipe(first()).subscribe({
      next: (cartItems) => {
        if (!cartItems || cartItems.length === 0) {
          alert("Votre panier est vide !");
          return;
        }


        const token = localStorage.getItem('token'); // Récupère ton token JWT stocké au login

        const headers = {
          'Authorization': `Bearer ${token}`
        };

        // 2. Construction de l'objet EXACT attendu par le DTO Spring Boot
        const commandeRequest = {
          items: cartItems.map(item => ({
            productId: Number(item.id), // Force le format Number
            quantite: Number(item.quantity)
          }))
        };

        const jsonString = JSON.stringify(commandeRequest, null, 2);

        console.log("--- COPIE CE JSON POUR POSTMAN ---");
        console.log(jsonString);
        console.log("----------------------------------");

        console.log("Envoi de la commande :", jsonString);

        // 3. Appel API
        this.http.post('http://localhost:8081/commandes', commandeRequest, { headers }).subscribe({
          next: (res) => {
            alert("Commande réussie !");
            this.cartService.clearCart();
          },
          error: (err) => {
            console.error("Détails de l'erreur 403 :", err);
            // Si c'est une 403, c'est un problème de droits ou de CORS
            alert("Accès refusé (403). Vérifiez votre connexion ou la config CORS.");
          }
        });
      }
    });
  }
}

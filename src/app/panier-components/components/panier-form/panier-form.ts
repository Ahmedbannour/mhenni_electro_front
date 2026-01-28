import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe, DecimalPipe } from '@angular/common';
import { CartService } from '../../../services/cart';

@Component({
  selector: 'app-panier-form',
  standalone: true,
  imports: [CommonModule, AsyncPipe, DecimalPipe], // OBLIGATOIRE
  templateUrl: './panier-form.html',
  styleUrl: './panier-form.css'
})
export class PanierForm {
  // On rend le service public pour l'utiliser dans le HTML
  public cartService = inject(CartService);
}

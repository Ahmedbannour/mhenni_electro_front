import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { PanierItem } from './components/panier-item/panier-item';
import { CartService } from '../../../services/cart';

@Component({
  selector: 'app-panier-list',
  standalone: true,
  // Ajoute AsyncPipe à la liste des imports
  imports: [CommonModule, PanierItem],
  templateUrl: './panier-list.html',
  styleUrl: './panier-list.css'
})
export class PanierList {
  public cartService = inject(CartService);
  items$ = this.cartService.items$;
}

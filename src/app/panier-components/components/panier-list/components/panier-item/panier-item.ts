import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { CartService } from '../../../../../services/cart';

@Component({
  selector: 'app-panier-item',
  standalone: true,
  imports: [DecimalPipe , CommonModule],
  templateUrl: './panier-item.html',
  styleUrl: './panier-item.css',
})


// panier-item.ts
export class PanierItem {
  @Input() item: any;
  private cartService = inject(CartService);

  increment() {
    console.log('Incrementing item ID:', this.item.id); // Petit debug Windows
    this.cartService.updateQuantity(this.item.id, 1);
  }

  decrement() {
    this.cartService.updateQuantity(this.item.id, -1);
  }
}

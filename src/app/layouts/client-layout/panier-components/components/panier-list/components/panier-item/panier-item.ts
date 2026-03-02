import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { CartService } from '../../../../../../../services/cart';

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
    this.cartService.updateQuantity(this.item.id, this.item.quantity + 1);
  }

  decrement() {
    if (this.item.quantity > 1) {
      this.cartService.updateQuantity(this.item.id, this.item.quantity - 1);
    }
  }

  remove() {
    if (confirm(`Voulez-vous vraiment supprimer ${this.item.label} ?`)) {
      this.cartService.removeFromCart(this.item.id);
    }
  }
}

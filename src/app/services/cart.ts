// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private initialItems = [
    { id: 1, name: 'Aurora Wireless Headphones', price: 129, quantity: 1, imageUrl: "assets/images/products/product-1.jpg" },
    { id: 2, name: 'Solstice Smartwatch', price: 199, quantity: 1, imageUrl: "assets/images/products/product-2.jpg" },
    { id: 3, name: 'KINGONE Stylus Pen', price: 39, quantity: 1, imageUrl: "assets/images/products/product-3.jpg" }
  ];

  private itemsSubject = new BehaviorSubject<any[]>(this.initialItems);
  items$ = this.itemsSubject.asObservable();

  // Observable du sous-total (se recalcule à chaque modification)
  subtotal$ = this.items$.pipe(
    map(items => items.reduce((acc, item) => acc + (item.price * item.quantity), 0))
  );

  updateQuantity(id: number, change: number) {
    // On crée une NOUVELLE liste (important pour que l'async pipe détecte le changement)
    const updatedItems = this.itemsSubject.value.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + change) };
      }
      return item;
    });

    // On diffuse la nouvelle liste
    this.itemsSubject.next(updatedItems);
  }
}

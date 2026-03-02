import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

// Interface pour typer tes produits dans le panier
export interface CartItem {
  id: number;
  label: string;
  price: number;
  quantity: number;
  image?: string;
  ref?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  // Initialisation avec le type CartItem[]
  private cartItems = new BehaviorSubject<CartItem[]>(this.getCartFromStorage());

  // Correction Erreur : items$
  items$: Observable<CartItem[]> = this.cartItems.asObservable();

  subtotal$ = this.items$.pipe(
    map(items => items.reduce((acc, item) => acc + (item.price * item.quantity), 0))
  );

  addToCart(product: any, quantity: number = 1) {
    const currentItems = [...this.cartItems.value];
    const existing = currentItems.find(i => i.id === product.id);

    if (existing) {
      existing.quantity += quantity; // On ajoute la quantité choisie
    } else {
      currentItems.push({ ...product, quantity: quantity });
    }
    this.updateCart(currentItems);
  }


  removeFromCart(productId: number) {
    // On garde tous les produits SAUF celui qui a l'ID en paramètre
    const currentItems = this.cartItems.value.filter(item => item.id !== productId);
    this.updateCart(currentItems);
  }

  updateQuantity(productId: number, quantity: number) {
    const currentItems = [...this.cartItems.value];
    const item = currentItems.find(i => i.id === productId);
    if (item && quantity > 0) {
      item.quantity = quantity;
      this.updateCart(currentItems);
    }
  }

  // Correction Erreur : clearCart
  clearCart() {
    this.updateCart([]);
  }

  private updateCart(items: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(items));
    this.cartItems.next(items);
  }

  private getCartFromStorage(): CartItem[] {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }
}

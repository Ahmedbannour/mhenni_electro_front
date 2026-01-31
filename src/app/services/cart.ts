// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private initialItems = {
    "status": "success",
    "total": 6,
    "currency": "USD",
    "products": [
      {
        "id": 1,
        "ref": "PRD-001",
        "label": "Aurora Wireless Headphones",
        "description": "Active noise cancellation · 30h battery life",
        "price": 129.99,
        "quantity": 25,
        "image": "assets/images/products/product-1.jpg",
        "category": "Electronics",
        "active": true
      },
      {
        "id": 2,
        "ref": "PRD-002",
        "label": "Solstice Smartwatch",
        "description": "Heart-rate monitor · GPS · 7-day battery",
        "price": 199.00,
        "quantity": 18,
        "image": "assets/images/products/product-2.jpg",
        "category": "Wearables",
        "active": true
      },
      {
        "id": 3,
        "ref": "PRD-003",
        "label": "KINGONE Stylus Pen",
        "description": "Ultra high precision · Compatible iPad",
        "price": 39.50,
        "quantity": 60,
        "image": "assets/images/products/product-3.jpg",
        "category": "Accessories",
        "active": true
      },
      {
        "id": 4,
        "ref": "PRD-004",
        "label": "Nova Bluetooth Speaker",
        "description": "360° sound · Waterproof IPX7",
        "price": 89.99,
        "quantity": 32,
        "image": "assets/images/products/product-4.jpg",
        "category": "Audio",
        "active": true
      },
      {
        "id": 5,
        "ref": "PRD-005",
        "label": "Orion Gaming Mouse",
        "description": "RGB · 16000 DPI · Ergonomic design",
        "price": 59.90,
        "quantity": 45,
        "image": "assets/images/products/product-5.jpg",
        "category": "Gaming",
        "active": true
      },
      {
        "id": 6,
        "ref": "PRD-006",
        "label": "Atlas Mechanical Keyboard",
        "description": "Mechanical switches · Backlit keys",
        "price": 109.00,
        "quantity": 20,
        "image": "assets/images/products/product-6.jpg",
        "category": "Gaming",
        "active": false
      }
    ]
  };


  private itemsSubject = new BehaviorSubject<any[]>(this.initialItems.products);
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

  getProductById(id: number) {
    return this.itemsSubject.value.find(p => p.id === id);
  }
  
}

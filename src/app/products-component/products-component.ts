import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { ProductItem } from "./components/product-item/product-item";
import { CartService } from '../services/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-component',
  imports: [ProductItem , CommonModule],
  templateUrl: './products-component.html',
  styleUrl: './products-component.css',
})


export class ProductsComponent {
  constructor(private router: Router) {}

  public cartService = inject(CartService);
  items$ = this.cartService.items$;


}

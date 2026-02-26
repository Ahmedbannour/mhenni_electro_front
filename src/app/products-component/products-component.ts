import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ProductItem } from "./components/product-item/product-item";
import { CartService } from '../services/cart';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/ProductService';

@Component({
  selector: 'app-products-component',
  standalone: true,
  imports: [ProductItem, CommonModule, RouterModule],
  templateUrl: './products-component.html',
  styleUrl: './products-component.css',
})


export class ProductsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  public cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  products: any[] = [];
  loading = true;

  ngOnInit(): void {
    // On écoute les changements de paramètres (ex: /products/8)
    this.route.params.subscribe(params => {
      const categoryId = params['id'];
      this.loadProducts(categoryId);
    });
  }

  loadProducts(categoryId?: number): void {
    this.loading = true;
    
    const request = categoryId ? this.productService.getProductsByCategory(categoryId): this.productService.getAllProducts();

    request.subscribe({
      next: (data) => {
        this.products = data;
        console.log("loadproduct : " , data);

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Erreur API', err);
        this.loading = false;
      }
    });
  }
}

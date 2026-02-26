import { Component, inject, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Pour l'ID
import { CommonModule } from '@angular/common';
import { tns } from 'tiny-slider';
import { CartService } from '../../services/cart';
import { ProductService } from '../../services/ProductService';
import { Product } from '../../shared/models/Product';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})


export class ProductDetails implements OnInit, AfterViewInit {
  // Injections
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);
  loading = true;

  product: Product | null = null;


  quantity: number = 1;

  ngOnInit() {

    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.loadProduct(productId);
    });
  }

  loadProduct(productId: number): void {
    this.loading = true;
    const request = this.productService.getProductById(productId);

    request.subscribe({
      next: (data) => {
        this.product = data;
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

  changeQty(val: number) {
    const newVal = this.quantity + val;
    if (newVal >= 1) {
      this.quantity = newVal;
    }
  }

  ngAfterViewInit() {
    // On vérifie que le produit existe avant de lancer le slider
    if (this.product) {
      tns({
        container: '.product-main-slider',
        items: 1,
        slideBy: 'page',
        autoplay: false,
        mouseDrag: true,
        controls: true,
        nav: true,
        navContainer: '#customize-thumbnails',
        navAsThumbnails: true,
      });
    }
  }
}

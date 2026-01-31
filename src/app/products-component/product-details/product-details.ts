import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Pour l'ID
import { CommonModule } from '@angular/common';
import { tns } from 'tiny-slider';
import { CartService } from '../../services/cart';

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

  item: any; // C'est ici qu'on stockera le produit trouvé
  quantity: number = 1;

  ngOnInit() {
    // 1. Récupérer l'ID de l'URL (ex: /products/1)
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // 2. Chercher le produit dans le service
    this.item = this.cartService.getProductById(id);

    if (!this.item) {
      console.error('Produit non trouvé !');
    }
  }

  changeQty(val: number) {
    const newVal = this.quantity + val;
    if (newVal >= 1) {
      this.quantity = newVal;
    }
  }

  ngAfterViewInit() {
    // On vérifie que l'item existe avant de lancer le slider
    if (this.item) {
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

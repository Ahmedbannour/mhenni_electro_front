import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../shared/models/Product';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-item.html',
  styleUrl: './product-item.css',
})
export class ProductItem {
    constructor(private router: Router) {}
    @Input() product: Product | null = null;


    goToDetails(id: number) {
      this.router.navigate(['/products', id]);
    }
}

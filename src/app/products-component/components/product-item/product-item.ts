import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-item.html',
  styleUrl: './product-item.css',
})
export class ProductItem {
    constructor(private router: Router) {}
    @Input() item: any;


    goToDetails(id: number) {
      this.router.navigate(['/products', id]);
    }
}

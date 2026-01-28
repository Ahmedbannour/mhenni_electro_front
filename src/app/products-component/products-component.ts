import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-products-component',
  imports: [],
  templateUrl: './products-component.html',
  styleUrl: './products-component.css',
})


export class ProductsComponent {
  constructor(private router: Router) {}

  goToDetails(id: number) {
    this.router.navigate(['/products', id]);
  }
}

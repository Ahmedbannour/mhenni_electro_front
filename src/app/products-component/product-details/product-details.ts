import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { tns } from 'tiny-slider';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  quantity: number = 1;

  changeQty(val: number) {
    const newVal = this.quantity + val;
    if (newVal >= 1) {
      this.quantity = newVal;
    }
  }

  images = [
    'assets/images/products/product-1.jpg',
    'assets/images/products/product-2.jpg',
    'assets/images/products/product-3.jpg',
    'assets/images/products/product-4.jpg'
  ];

  ngAfterViewInit() {
    tns({
      container: '.product-main-slider',
      items: 1,
      slideBy: 'page',
      autoplay: false,
      mouseDrag: true,
      controls: true,
      nav: true,
      navContainer: '#customize-thumbnails', // Lie les miniatures au slider
      prevButton: '#prev-btn',
      nextButton: '#next-btn',
      navAsThumbnails: true,
    });
  }
}

import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-widget.html',
  styleUrl: './products-widget.css'
})
export class ProductsWidget {
  @Input() categories: any[] = [];
  @Input() products: any[] = []; // Nouvelle entrée pour les produits
  @Input() currentCategoryName: string = '';

  @Output() onSelect = new EventEmitter<any>();
  @Output() onAddSubCat = new EventEmitter<void>();
  @Output() onAddProduct = new EventEmitter<void>();


  private cdr = inject(ChangeDetectorRef);



  selectCategory(cat: any) {
    this.onSelect.emit(cat);
    this.cdr.detectChanges();

  }
}

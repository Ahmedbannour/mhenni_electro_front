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
  @Input() isLoading: boolean = false;


  @Output() onSelect = new EventEmitter<any>();
  @Output() onAddSubCat = new EventEmitter<void>();
  @Output() onAddProduct = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onView = new EventEmitter<any>();

  onViewDetails(cat: any) {
    this.onView.emit(cat);
  }

  onEditCategory(cat: any) {

    console.log("emit edit : ", cat);
    this.onEdit.emit(cat);
  }

  onDeleteCategory(cat: any) {
    // Optionnel: ajouter un confirm() ici ou dans le parent
    this.onDelete.emit(cat);
  }

  private cdr = inject(ChangeDetectorRef);

  // Pagination & Tri
  currentPage: number = 1;
  pageSize: number = 5;
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';


  selectCategory(cat: any) {
    this.onSelect.emit(cat);
    this.cdr.detectChanges();

  }

  get filteredProducts() {
    let sorted = [...this.products].sort((a, b) => {
      const res = a[this.sortColumn] < b[this.sortColumn] ? -1 : a[this.sortColumn] > b[this.sortColumn] ? 1 : 0;
      return this.sortDirection === 'asc' ? res : -res;
    });

    const startIndex = (this.currentPage - 1) * this.pageSize;
    return sorted.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.products.length / this.pageSize);
  }


  // Fonction pour trier
  setSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }
}

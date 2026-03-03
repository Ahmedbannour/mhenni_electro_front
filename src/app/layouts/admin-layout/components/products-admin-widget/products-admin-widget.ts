import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsWidget } from "./components/products-widget/products-widget";
import { CategoriesService } from '../../../../services/CategoriesService';
import { ProductService } from '../../../../services/ProductService';
import { Product } from '../../../client-layout/shared/models/Product';

@Component({
  selector: 'app-products-admin-widget',
  standalone: true,
  imports: [CommonModule, ProductsWidget],
  templateUrl: './products-admin-widget.html',
})


export class ProductsAdminWidget implements OnInit {
  private categoriesService = inject(CategoriesService);
  private productService = inject(ProductService); // Assuming this is the correct service for products
  private cdr = inject(ChangeDetectorRef);


  allCategories: any[] = []; // Stock complet
  currentCategories: any[] = []; // Ce qui est affiché
  breadcrumb: any[] = []; // La pile de navigation
  currentProducts: Product[] = [];



  ngOnInit(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.allCategories = response.data;
          // Au début, on affiche uniquement celles qui n'ont pas de parent
          this.currentCategories = this.allCategories.filter(c => c.parent === null);
          this.cdr.detectChanges();
        }
      }
    });
  }

  // Quand on clique sur une catégorie dans le widget
  onCategorySelect(category: any): void {
    this.breadcrumb.push(category);

    if (category.subCategories && category.subCategories.length > 0) {
      // Cas : On affiche les sous-catégories
      this.currentCategories = category.subCategories;
      this.currentProducts = [];
    } else {
      // Cas : C'est une feuille, on vide les catégories et on charge les produits
      this.currentCategories = [];
      this.loadProductsByCat(category.id);
    }

    this.cdr.detectChanges();

  }

  loadProductsByCat(categoryId: number) {
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (response) => {
          // Vérification du champ "status" envoyé par votre backend
          if (response.status === 'success') {


            this.currentProducts = response.data;
            this.cdr.detectChanges();

            console.log(response.message);
          } else {
            alert("Erreur: " + response.message);
          }
        },
        error: (err) => {
          // En cas d'erreur 400 ou 403 (token manquant ou invalide)
          console.error("Erreur lors du chargement des produits", err);
          alert("Une erreur technique est survenue.");
        }
    });
  }

  navigateTo(index: number): void {
    console.log("navigateTo function");

    if (index === -1) {
      this.breadcrumb = [];
      this.currentProducts = [];
      this.currentCategories = this.allCategories.filter(c => c.parent === null);
    } else {
      const target = this.breadcrumb[index];
      this.breadcrumb = this.breadcrumb.slice(0, index + 1);

      // On réapplique la même logique de vérification
      if (target.subCategories && target.subCategories.length > 0) {
        this.currentCategories = target.subCategories;
        this.currentProducts = [];
      } else {
        this.currentCategories = [];
        this.loadProductsByCat(target.id);
      }
    }

    this.cdr.detectChanges();
  }



  // 1. Bouton "Ajouter" global (Header)
  handleAddCategory() {
    const parent = this.breadcrumb.length > 0 ? this.breadcrumb[this.breadcrumb.length -1] : null;
    alert(`Ajouter une catégorie sous : ${parent ? parent.name : 'Racine'}`);
    // Ici : Ouvrir votre modal de création de catégorie
  }

  // 2. Bouton "Ajouter sous-catégorie" (Si vide)
  handleAddSubCategory(event: any) {
    const currentCat = this.breadcrumb[this.breadcrumb.length - 1];
    console.log("Création d'une sous-catégorie pour", currentCat.name);
    // Logique modal catégorie
  }

  // 3. Bouton "Ajouter produit" (Si vide)
  handleAddProduct(event: any) {
    const currentCat = this.breadcrumb[this.breadcrumb.length - 1];
    console.log("Création d'un produit dans", currentCat.name);
    // Logique modal produit
  }
}

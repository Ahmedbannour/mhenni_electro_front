import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsWidget } from "./components/products-widget/products-widget";
import { CategoriesService } from '../../../../services/CategoriesService';
import { ProductService } from '../../../../services/ProductService';
import { Product } from '../../../client-layout/shared/models/Product';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-products-admin-widget',
  standalone: true,
  imports: [CommonModule, ProductsWidget, ReactiveFormsModule],
  templateUrl: './products-admin-widget.html',
})


export class ProductsAdminWidget implements OnInit {
  private categoriesService = inject(CategoriesService);
  private productService = inject(ProductService); // Assuming this is the correct service for products
  private cdr = inject(ChangeDetectorRef);

  productForm: FormGroup;
  leafCategories: any[] = []; // Liste pour le dropdown du modal

  allCategories: any[] = []; // Stock complet
  currentCategories: any[] = []; // Ce qui est affiché
  breadcrumb: any[] = []; // La pile de navigation
  currentProducts: Product[] = [];
  isLoading: boolean = false;
  alertMessage: string | null = null;
  alertClass: string = 'alert-success';


  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      label: ['', Validators.required],
      ref: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      date_achat: [new Date().toISOString().substring(0, 10), Validators.required],
      categorie: [null, Validators.required]
    });
  }

  // Fonction récursive pour trouver les catégories feuilles
  getLeafCategories(cats: any[]) {
    cats.forEach(c => {
      if (!c.subCategories || c.subCategories.length === 0) {
        this.leafCategories.push(c);
      } else {
        this.getLeafCategories(c.subCategories);
      }
    });
  }


  handleAddProduct(event: any) {
    this.leafCategories = [];
    this.getLeafCategories(this.allCategories);

    // Pré-remplissage avec l'objet complet
    const currentCat = this.breadcrumb[this.breadcrumb.length - 1];
    if (currentCat && (!currentCat.subCategories || currentCat.subCategories.length === 0)) {
        this.productForm.patchValue({ categorie: currentCat });
    }

    const modalElement = document.getElementById('addProductModal');
    if (modalElement) {
       const m = new (window as any).bootstrap.Modal(modalElement);
       m.show();
    }
  }

  submitProduct() {
    if (this.productForm.valid) {
      // Le JSON généré correspondra exactement à votre structure attendue
      const productData = this.productForm.value;

      const formattedDate = productData.date_achat + " 00:00:00";


      const productToSend = {
        ...productData,
        date_achat: formattedDate
      };


      this.productService.saveProduct(productToSend).subscribe({
        next: (response) => {
         if (response.status === 'success') {


          this.closeModal();

          // 2. Afficher l'alerte de succès
          this.showAlert("Produit enregistré avec succès !", "alert-success");

          const currentCat = this.breadcrumb[this.breadcrumb.length - 1];
          if (currentCat) {
            this.loadProductsByCat(currentCat.id);
          }

          this.productForm.reset({
            price: 0,
            date_achat: new Date().toISOString().substring(0, 10)
          });

          } else {
            this.showAlert("Erreur lors de l'enregistrement du produit.", "alert-danger");
            alert("Erreur: " + response.message);
          }
          this.isLoading = false; // 👈 Fin du chargement (succès)
          this.cdr.detectChanges();
        },
        error: (err) => {
          // En cas d'erreur 400 ou 403 (token manquant ou invalide)
          this.isLoading = false; // 👈 Fin du chargement (succès)
          this.showAlert("Erreur lors de l'enregistrement du produit.", "alert-danger");
          console.error("Erreur lors du chargement des produits", err);
          alert("Une erreur technique est survenue.");
        }
      });
    }
  }

  // Utilitaire pour fermer la modal
  private closeModal() {
    const modalElement = document.getElementById('addProductModal');
    if (modalElement) {
      const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();
    }
  }


  private showAlert(message: string, type: 'alert-success' | 'alert-danger') {
    this.alertMessage = message;
    this.alertClass = type;
    this.cdr.detectChanges();

    // Masquer l'alerte automatiquement après 5 secondes
    setTimeout(() => {
      this.alertMessage = null;
      this.cdr.detectChanges();
    }, 5000);
  }

  ngOnInit(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.allCategories = response.data;
          // Au début, on affiche uniquement celles qui n'ont pas de parent
          this.currentCategories = this.allCategories.filter(c => c.parent === null);
        }
        this.cdr.detectChanges();
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
    this.isLoading = true; // 👈 On commence le chargement
    this.currentProducts = []; // On vide les anciens produits pour ne pas les voir pendant le chargement
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (response) => {
          // Vérification du champ "status" envoyé par votre backend
          if (response.status === 'success') {


            this.currentProducts = response.data;

          } else {
            alert("Erreur: " + response.message);
          }
          this.isLoading = false; // 👈 Fin du chargement (succès)
          this.cdr.detectChanges();
        },
        error: (err) => {
          // En cas d'erreur 400 ou 403 (token manquant ou invalide)
          this.isLoading = false; // 👈 Fin du chargement (succès)
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



}

import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsWidget } from "./components/products-widget/products-widget";
import { CategoriesService } from '../../../../services/CategoriesService';
import { ProductService } from '../../../../services/ProductService';
import { Product } from '../../../client-layout/shared/models/Product';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categorie } from '../../../client-layout/shared/models/Categorie';

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
  selectedCategory: any = null;
  isEditMode: boolean = false;
  categoryForm: FormGroup;

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }


  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
  }



  // 1. Action Voir Détails
  handleViewCategory(cat: any) {
    this.selectedCategory = cat;
    this.openModal('categoryDetailsModal');
  }

  handleEditCategory(cat: Categorie) {
    this.selectedCategory = cat;
    this.isEditMode = true;

    this.leafCategories = [];
    this.getAllPotentialParents(this.allCategories);

    this.categoryForm.patchValue({
      name: cat.name,
      description: cat.description,
      parent: cat.parent ? cat.parent : null
    });

    this.openModal('categoryFormModal');
  }


  getAllPotentialParents(cats: any[]) {
    cats.forEach(c => {
      if (this.selectedCategory && c.id !== this.selectedCategory.id) {
        this.leafCategories.push(c);
        if (c.subCategories) {
          this.getAllPotentialParents(c.subCategories);
        }
      } else if (!this.selectedCategory) {
        this.leafCategories.push(c); // Pour l'ajout simple
      }
    });
  }

  handleAddCategory() {
    this.isEditMode = false;
    this.categoryForm.reset();
    this.openModal('categoryFormModal');
  }

  submitCategory() {
    if (this.categoryForm.valid) {
      const formValues = this.categoryForm.value;

      let parentId = null;

      if (formValues.parent) {
        parentId = typeof formValues.parent === 'object'
          ? formValues.parent.id
          : formValues.parent;
      }



      const categoryRequest = {
        id: this.selectedCategory?.id,
        name: formValues.name,
        description: formValues.description,
        parent: parentId ? { id: parentId } : null
      };



      console.log("Données envoyées :", categoryRequest);

      this.categoriesService.saveCategory(categoryRequest).subscribe({
        next: () => {
          this.showAlert("Catégorie mise à jour !", "alert-success");
          this.closeModalById('categoryFormModal');
          this.refreshData();
        },
        error: (err) => {
          console.error("Erreur Backend:", err);
          this.showAlert("Erreur lors de la sauvegarde", "alert-danger");
        }
      });
    }
  }

  compareCategories(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }


  confirmDeleteCategory(cat: any) {
    this.selectedCategory = cat;
    this.openModal('deleteConfirmModal');
  }

  executeDelete() {
    this.categoriesService.deleteCategory(this.selectedCategory.id).subscribe({
      next: () => {
        this.showAlert("Catégorie supprimée", "alert-success");
        this.closeModalById('deleteConfirmModal');
        this.refreshData();
      },
      error: () => this.showAlert("Impossible de supprimer (contient des produits ou sous-cats)", "alert-danger")
    });
  }

  // Recharge les données et maintient la navigation
  refreshData() {
    this.categoriesService.getAllCategories().subscribe(res => {
      if (res.status === 'success') {
        this.allCategories = res.data;
        // Si on est dans une sous-catégorie, on met à jour la vue actuelle
        if (this.breadcrumb.length > 0) {
          const currentId = this.breadcrumb[this.breadcrumb.length - 1].id;
          // Retrouver la version fraîche de la catégorie actuelle dans allCategories
          const freshCat = this.findCategoryById(this.allCategories, currentId);
          if (freshCat) {
            this.currentCategories = freshCat.subCategories || [];
          }
        } else {
          this.currentCategories = this.allCategories.filter(c => c.parent === null);
        }
      }
      this.cdr.detectChanges();
    });
  }

  private findCategoryById(list: any[], id: number): any {
    for (const cat of list) {
      if (cat.id === id) return cat;
      if (cat.subCategories) {
        const found = this.findCategoryById(cat.subCategories, id);
        if (found) return found;
      }
    }
    return null;
  }


  private openModal(id: string) {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      const m = new (window as any).bootstrap.Modal(modalElement);
      m.show();
    }
  }

  private closeModalById(id: string) {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      const m = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (m) m.hide();
    }
  }


  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      label: ['', Validators.required],
      ref: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      date_achat: [new Date().toISOString().substring(0, 10), Validators.required],
      categorie: [null, Validators.required]
    });


    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      parent: [null]
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
      this.isLoading = true;
      const productData = this.productForm.value;
      const formattedDate = productData.date_achat + " 00:00:00";

      // Création du FormData
      const formData = new FormData();

      // On construit l'objet produit
      const productToSend = {
        ...productData,
        date_achat: formattedDate
      };

      // On ajoute le produit sous forme de Blob JSON
      formData.append('product', new Blob([JSON.stringify(productToSend)], {
        type: 'application/json'
      }));

      // On ajoute l'image si elle existe
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }


      console.log("form data : ", formData);

      // Appeler une nouvelle méthode de service capable de gérer FormData
      this.productService.saveProduct(formData).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.closeModal();
            this.showAlert("Produit enregistré avec succès !", "alert-success");
            this.removeImage(); // Reset image

            const currentCat = this.breadcrumb[this.breadcrumb.length - 1];
            if (currentCat) this.loadProductsByCat(currentCat.id);

            this.productForm.reset({
              price: 0,
              date_achat: new Date().toISOString().substring(0, 10)
            });
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          this.showAlert("Erreur lors de l'enregistrement.", "alert-danger");
          this.cdr.detectChanges();
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



  // 2. Bouton "Ajouter sous-catégorie" (Si vide)
  handleAddSubCategory(event: any) {
    const currentCat = this.breadcrumb[this.breadcrumb.length - 1];
    console.log("Création d'une sous-catégorie pour", currentCat.name);
    // Logique modal catégorie
  }



}

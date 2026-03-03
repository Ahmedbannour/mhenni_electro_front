import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Depot, DepotsService } from '../../../../../../services/depotsService';

@Component({
  selector: 'app-depot-table',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './depot-table.html',
  styleUrl: './depot-table.css',
})
export class DepotTable implements OnInit{

  private route = inject(ActivatedRoute);
  private depotsService = inject(DepotsService);
  private cdr = inject(ChangeDetectorRef);
  private loading = true;
  depots: Depot[] = [];
  selectedDepot: any = null;
  depotToDelete: any = null;

  viewDetails(depot: any) {
    this.selectedDepot = depot;
    // La modal est déclenchée par les attributs data-bs dans le HTML
  }


  ngOnInit(): void {

    this.loadDepots();
  }


  loadDepots(): void {
    this.loading = true;

    const request =  this.depotsService.getAllDepots();

    request.subscribe({
      next: (data: Depot[]) => {
        this.depots = data;
        console.log("loadDepots : " , data);

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Erreur API', err);
        this.loading = false;
      }
    });
  }




  // Préparer la suppression et ouvrir la modal
  deleteDepot(depot: any): void {
    this.depotToDelete = depot;
    // La modal est ouverte via data-bs-target dans le HTML
  }


  // Action finale de suppression
  confirmDeletion(): void {
    if (this.depotToDelete) {
      const id = this.depotToDelete.id;

      this.depotsService.deleteDepot(id).subscribe({
        next: (response) => {
          // Vérification du champ "status" envoyé par votre backend
          if (response.status === 'success') {
            // 1. Mise à jour de la liste locale (crée une nouvelle référence)
            this.depots = this.depots.filter(d => d.id !== id);

            // 2. IMPORTANT : Force la détection de changement pour mettre à jour le tableau HTML
            this.cdr.detectChanges();

            // 3. Réinitialiser la sélection
            this.depotToDelete = null;

            console.log(response.message);
          } else {
            alert("Erreur: " + response.message);
          }
        },
        error: (err) => {
          // En cas d'erreur 400 ou 403 (token manquant ou invalide)
          console.error("Erreur lors de la suppression", err);
          alert("Une erreur technique est survenue.");
        }
      });
    }
  }


  calculateTotalQuantity(depot: any): number {
    if (!depot || !depot.depotProducts || !Array.isArray(depot.depotProducts)) {
      return 0;
    }

    // Somme des quantités de chaque ligne DepotProduct
    return depot.depotProducts.reduce((sum: number, item: any) => {
      // On s'assure que item.quantity est un nombre pour éviter les erreurs de type string
      const qty = typeof item.quantity === 'number' ? item.quantity : 0;
      return sum + qty;
    }, 0);
  }
}

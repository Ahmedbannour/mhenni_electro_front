import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Evenement, EvenementsService } from '../../../../../../services/evenements-service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-evenements-table',
  imports: [DatePipe , CommonModule],
  templateUrl: './evenements-table.html',
  styleUrl: './evenements-table.css',
})
export class EvenementsTable {

  @Output() onEdit = new EventEmitter<any>(); // Émetteur pour la modification


  private route = inject(ActivatedRoute);
  private evenementsService = inject(EvenementsService);
  private cdr = inject(ChangeDetectorRef);
  private loading = true;
  evenements: Evenement[] = [];
  selectedEvenement: any = null;
  evenementToDelete: any = null;

  viewDetails(evenement: any) {
    this.selectedEvenement = evenement;
    // La modal est déclenchée par les attributs data-bs dans le HTML
  }


  ngOnInit(): void {

    this.loadEvenements();
  }


  editEvenement(evenement: any): void {
    this.onEdit.emit(evenement); // On envoie l'objet au parent
  }

  loadEvenements(): void {
    this.loading = true;

    const request =  this.evenementsService.getAllEvenements();

    request.subscribe({
      next: (response) => {
          // Vérification du champ "status" envoyé par votre backend
          if (response.status === 'success') {
            // 1. Mise à jour de la liste locale (crée une nouvelle référence)
            this.evenements = response.data;


            console.log("evenements : ", response.data);


            // 2. IMPORTANT : Force la détection de changement pour mettre à jour le tableau HTML
            this.cdr.detectChanges();
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




  // Préparer la suppression et ouvrir la modal
  deleteEvenement(evenement: any): void {
    this.evenementToDelete = evenement;
    // La modal est ouverte via data-bs-target dans le HTML
  }


  // Action finale de suppression
  confirmDeletion(): void {
    if (this.evenementToDelete) {
      const id = this.evenementToDelete.id;

      this.evenementsService.deleteEvenement(id).subscribe({
        next: (response) => {
          // Vérification du champ "status" envoyé par votre backend
          if (response.status === 'success') {
            // 1. Mise à jour de la liste locale (crée une nouvelle référence)
            this.evenements = this.evenements.filter(e => e.id !== id);

            // 2. IMPORTANT : Force la détection de changement pour mettre à jour le tableau HTML
            this.cdr.detectChanges();

            // 3. Réinitialiser la sélection
            this.evenementToDelete = null;

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

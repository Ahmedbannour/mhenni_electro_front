import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Evenement, EvenementsService } from '../../../../../../services/evenements-service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dons } from '../../../../../../services/Dons-service';
import { DonsService } from '../../../../../../services/Dons-service';
import { Garantie, GarantieService } from '../../../../../../services/garantieService';

@Component({
  selector: 'app-garantie-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './garantie-table.html',
  styleUrl: './garantie-table.css',
})
export class GarantieTable {

  @Output() onEdit = new EventEmitter<any>(); // Émetteur pour la modification


  private route = inject(ActivatedRoute);
  private garantieService = inject(GarantieService);
  private cdr = inject(ChangeDetectorRef);
  private loading = true;
  garanties: Garantie[] = [];
  selectedGarantie: any = null;
  garantiesToDelete: any = null;

  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5; // Taille par défaut
  pageSizes: number[] = [5, 10, 50, 100];



  viewDetails(garantie: any) {
    this.selectedGarantie = garantie;
    // La modal est déclenchée par les attributs data-bs dans le HTML
  }


  ngOnInit(): void {

    this.loadGaranties();
  }


  editGarantie(garantie: any): void {
    this.onEdit.emit(garantie); // On envoie l'objet au parent
  }

  loadGaranties(): void {
    this.loading = true;

    const request =  this.garantieService.getAllGaranties();

    request.subscribe({
      next: (response) => {
          // Vérification du champ "status" envoyé par votre backend
          if (response.status === 'success') {
            // 1. Mise à jour de la liste locale (crée une nouvelle référence)
            this.garanties = response.data;


            console.log("garanties : ", response.data);


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
  deleteGarantie(garantie: any): void {
    this.garantiesToDelete = garantie;
    // La modal est ouverte via data-bs-target dans le HTML
  }


  // Action finale de suppression
  confirmDeletion(): void {
    if (this.garantiesToDelete) {
      const id = this.garantiesToDelete.id;

      this.garantieService.deleteGarantie(id).subscribe({
        next: (response) => {
          // Vérification du champ "status" envoyé par votre backend
          if (response.status === 'success') {
            // 1. Mise à jour de la liste locale (crée une nouvelle référence)
            this.garanties = this.garanties.filter(g => g.id !== id);

            // 2. IMPORTANT : Force la détection de changement pour mettre à jour le tableau HTML
            this.cdr.detectChanges();

            // 3. Réinitialiser la sélection
            this.garantiesToDelete = null;


            this.loadGaranties(); // Rafraîchir la liste après suppression
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


  formatDateForInput(date: string | Date): string {
    if (!date) return '';

    // On transforme en objet Date, peu importe si c'est déjà une Date ou une String
    const d = new Date(date);

    // Vérifie si la date est valide pour éviter les crashs
    if (isNaN(d.getTime())) return '';

    // Formate pour l'input datetime-local (YYYY-MM-DDTHH:mm)
    // On utilise le décalage local car toISOString() convertit en UTC (Z)
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);

    return localISOTime;
  }


  // Ce GETTER rend le tableau ultra dynamique
  get filteredGaranties() {
    // 1. On filtre d'abord la liste complète selon le terme de recherche
    const filtered = this.garanties.filter(g => {
      if (!this.searchTerm) return true;

      const term = this.searchTerm.toLowerCase();
      // On cherche dans le label et dans les dates transformées en texte
      return (
        g.label?.toLowerCase().includes(term) ||
        new Date(g.date_debut).toLocaleString().toLowerCase().includes(term) ||
        new Date(g.date_expiration).toLocaleString().toLowerCase().includes(term)
      );
    });

    // 2. On applique la pagination sur les résultats filtrés
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(startIndex, startIndex + this.pageSize);
  }

  // Pour calculer le nombre de pages total dynamiquement
  get totalPages(): number {
    const count = this.garanties.filter(g => {
      if (!this.searchTerm) return true;
      const term = this.searchTerm.toLowerCase();
      return g.label?.toLowerCase().includes(term);
    }).length;
    return Math.ceil(count / this.pageSize);
  }


  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onPageSizeChange(event: any) {
    this.pageSize = +event.target.value;
    this.currentPage = 1; // Reset à la première page
  }
}

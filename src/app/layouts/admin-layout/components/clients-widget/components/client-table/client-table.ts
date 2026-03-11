import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Client, ClientsService } from '../../../../../../services/ClientsService';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-table',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './client-table.html',
  styleUrl: './client-table.css',
})
export class ClientTable implements OnInit{

  private route = inject(ActivatedRoute);
  private clientsService = inject(ClientsService);
  private cdr = inject(ChangeDetectorRef);
  private loading = true;
  clients: Client[] = [];
  selectedClient: any = null;
  clientToDelete: any = null;

  viewDetails(client: any) {
    this.selectedClient = client;
    // La modal est déclenchée par les attributs data-bs dans le HTML
  }
  ngOnInit(): void {

    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;

    const request =  this.clientsService.getAllClients();

    request.subscribe({
      next: (data: Client[]) => {
        this.clients = data;
        console.log("loadclients : " , data);

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
  deleteClient(client: any): void {
    this.clientToDelete = client;
    // La modal est ouverte via data-bs-target dans le HTML
  }


  // Action finale de suppression
  confirmDeletion(): void {
    if (this.clientToDelete) {
      const id = this.clientToDelete.id;

      this.clientsService.deleteClient(id).subscribe({
        next: (response) => {
          // Vérification du champ "status" envoyé par votre backend
          if (response.status === 'success') {
            // 1. Mise à jour de la liste locale (crée une nouvelle référence)
            this.clients = this.clients.filter(c => c.id !== id);

            // 2. IMPORTANT : Force la détection de changement pour mettre à jour le tableau HTML
            this.cdr.detectChanges();

            // 3. Réinitialiser la sélection
            this.clientToDelete = null;

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
}

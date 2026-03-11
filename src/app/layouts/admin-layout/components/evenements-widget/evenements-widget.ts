import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EvenementsTable } from "./Components/evenements-table/evenements-table";
import { EvenementsService } from '../../../../services/evenements-service';

@Component({
  selector: 'app-evenements-widget',
  standalone: true,
  imports: [CommonModule, EvenementsTable, ReactiveFormsModule],
  templateUrl: './evenements-widget.html',
  styleUrl: './evenements-widget.css',
})
export class EvenementsWidget {
  // Référence pour rafraîchir la table après l'ajout
  @ViewChild(EvenementsTable) tableComponent!: EvenementsTable;

  showForm = false;
  isEditMode = false;
  currentEditId: number | null = null;
  eventForm: FormGroup;


  constructor(private fb: FormBuilder, private evenementsService: EvenementsService) {
    this.eventForm = this.fb.group({
      label: ['', [Validators.required]],
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required]
    }, { validators: this.dateComparisonValidator });
  }


  // Lancé quand on clique sur "Modifier" dans la table
  handleEdit(evenement: any) {
    this.isEditMode = true;
    this.showForm = true;
    this.currentEditId = evenement.id;

    // Remplir le formulaire avec les valeurs actuelles
    this.eventForm.patchValue({
      label: evenement.label,
      date_debut: this.formatDateForInput(evenement.date_debut),
      date_fin: this.formatDateForInput(evenement.date_fin)
    });
  }


  formatDateForInput(date: string) {
    return date ? new Date(date).toISOString().slice(0, 16) : '';
  }


  submit() {
    if (this.eventForm.valid) {
      const obs = this.isEditMode
        ? this.evenementsService.updateEvenement(this.currentEditId!, this.eventForm.value)
        : this.evenementsService.saveEvenement(this.eventForm.value);

      obs.subscribe({
        next: (response) => {
          this.cancelForm();
          this.tableComponent.loadEvenements(); // Rafraîchir la liste
        },
        error: (err) => alert("Erreur technique")
      });
    }
  }


  cancelForm() {
    this.showForm = false;
    this.isEditMode = false;
    this.currentEditId = null;
    this.eventForm.reset();
  }

  

  // Validateur personnalisé : Date Début < Date Fin
  dateComparisonValidator(group: FormGroup) {
    const debut = group.get('date_debut')?.value;
    const fin = group.get('date_fin')?.value;
    if (debut && fin && new Date(debut) >= new Date(fin)) {
      return { dateInvalid: true };
    }
    return null;
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.eventForm.reset();
  }

}

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { LocationService, Region } from '../../../services/location';
import { Ville } from '../../../services/ClientsService';

@Component({
  selector: 'app-register-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})

export class RegisterComponent {
  private fb = inject(FormBuilder);
  submitted = false;
  regions: Region[] = [];
  filteredVilles: Ville[] = [];

  constructor(
    private authService: AuthService, // Injecte ton AuthService
    private router: Router, // Injecte le Router
    private locationService: LocationService,
  ) {}

  ngOnInit(): void {
    this.loadLocations();
  }


  loadLocations() {
    this.locationService.getRegions().subscribe({
      next: (data) => {
        this.regions = data;
      },
      error: (err) => console.error('Erreur chargement régions', err)
    });
  }


  onRegionChange(event: any) {
    const regionId = +event.target.value; // On récupère l'ID de la région sélectionnée
    const selectedRegion = this.regions.find(r => r.id === regionId);

    // On extrait les villes de la région sélectionnée
    this.filteredVilles = selectedRegion ? selectedRegion.villes : [];


    this.registerForm.patchValue({ ville: null });
  }

  registerForm = this.fb.nonNullable.group({
    nom: ['', [Validators.required, Validators.minLength(2)]],
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [
      Validators.required,
      Validators.pattern(/^\+?[0-9]{8,15}$/)
    ]],
    date_naissance: ['', [Validators.required, this.minimumAgeValidator(12)]],
    password: ['', [
      Validators.required,
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
      )
    ]],
    confirmPassword: ['', Validators.required],
    region: ['', Validators.required],
    ville: [null, Validators.required]
  }, {
    validators: this.passwordMatchValidator
  });

  get f() {
    return this.registerForm.controls;
  }

  submit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }


    console.log(this.registerForm.value);


    const formValue = this.registerForm.value;

    const payload = {
      ...formValue,
      ville: { id: formValue.ville } // On formate ici pour envoyer { "ville": { "id": X } }
    };

    // On supprime "region" du payload final car le backend n'en a pas besoin
    delete (payload as any).region;

    this.authService.register(payload).subscribe({
      next: (response: any) => {
        alert('✅ Registration successful! Please log in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration error:', err);
        alert('❌ Registration failed: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }

  passwordMatchValidator(form: any) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  minimumAgeValidator(minAge: number) {
    return (control: any) => {
      const birth = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      if (
        today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
      ) {
        age--;
      }
      return age >= minAge ? null : { minAge: true };
    };
  }
}

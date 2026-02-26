import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Importe le Router
import { AuthService } from '../services/auth-service';


@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage: string = ''; // Pour afficher les erreurs du backend (ex: 401)

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // Injecte ton AuthService
    private router: Router // Injecte le Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]] // On simplifie pour le login (la validation forte est pour le register)
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {

    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    console.log("part 2 : ", this.loginForm.value);
    // 👉 Appel au Backend via l'AuthService
    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {


        // 1. Sauvegarde le token (le format correspond à ton ApiResponse Spring Boot)
        this.authService.saveToken(response.data.token);

        // 2. Récupère le rôle pour décider de la destination
        const role = this.authService.getUserRole();


        console.log('user role : ' , role);

        // 3. Redirection intelligente
        if (role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else if (role === 'ROLE_USER') {
          this.router.navigate(['/client-dashboard']);
        } else {
          // Cas par défaut ou erreur de rôle
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        // Affiche le message d'erreur custom que tu as créé dans Spring Boot
        this.errorMessage = err.error?.message || "Une erreur est survenue lors de la connexion.";
        console.error('Login Error:', err);
      }
    });
  }
}

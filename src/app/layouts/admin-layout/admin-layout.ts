import { AfterViewInit, Component } from '@angular/core';
import { Slidebar } from "./shared/slidebar/slidebar";
import { Navbar } from "./shared/navbar/navbar";
import { AdminHome } from "./components/admin-home/admin-home";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-admin-layout',
  imports: [Slidebar, Navbar, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout implements AfterViewInit {
  ngAfterViewInit() {
    // Initialisez vos tooltips ou dropdowns ici manuellement si besoin
    // Évitez d'appeler des fonctions qui bouclent sur elles-mêmes
  }

}

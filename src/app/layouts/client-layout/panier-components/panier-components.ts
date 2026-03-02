import { Component } from '@angular/core';
import { PanierList } from "./components/panier-list/panier-list";
import { PanierForm } from "./components/panier-form/panier-form";

@Component({
  selector: 'app-panier-components',
  imports: [PanierList, PanierForm],
  templateUrl: './panier-components.html',
  styleUrl: './panier-components.css',
})
export class PanierComponents {


}

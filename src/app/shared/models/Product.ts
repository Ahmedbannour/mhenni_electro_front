import { Categorie } from "./Categorie";

export interface Product {
  id: number;
  description: string;
  label: string;
  price: number;
  image: string | null;
  ref: string;
  date_achat: string; // ou Date si tu préfères
  garantie: string | null;
  depotProducts: any[]; // à définir selon ta structure
  ligneCommandes: any[]; // à définir selon ta structure
  categorie: Categorie; // la catégorie associée à ce produit
}

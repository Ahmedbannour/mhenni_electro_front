export interface Categorie {
  id: number;
  name: string;
  description: string;
  parent: any; // ou Categorie | null
  subCategories: Categorie[];
  products: any[];
}


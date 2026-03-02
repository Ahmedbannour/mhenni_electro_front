import { Component } from '@angular/core';
import { RouterLink, RouterModule } from "@angular/router";
import { Categories } from "./categories/categories";

@Component({
  selector: 'app-bottom-header',
  imports: [RouterLink, RouterModule, Categories],
  templateUrl: './bottom-header.html',
  styleUrl: './bottom-header.css',
})
export class BottomHeader {

}

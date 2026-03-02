import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';

@Component({
  selector: 'app-client-layout',
  imports: [Navbar, RouterModule, Footer],
  templateUrl: './client-layout.html',
  styleUrl: './client-layout.css',
})
export class ClientLayout {

}

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layouts/client-layout/shared/components/navbar/navbar';
import { Footer } from './layouts/client-layout/shared/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('electro-mhenni');


  user = "Ahmed Bannour";
  age = 28;
}

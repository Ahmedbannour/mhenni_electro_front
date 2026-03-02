import { Component } from '@angular/core';
import { ClientTable } from "./components/client-table/client-table";

@Component({
  selector: 'app-clients-widget',
  imports: [ClientTable],
  templateUrl: './clients-widget.html',
  styleUrl: './clients-widget.css',
})
export class ClientsWidget {

}

import { Component } from '@angular/core';
import { DepotTable } from "./components/depot-table/depot-table";

@Component({
  selector: 'app-depot-widget',
  imports: [DepotTable],
  templateUrl: './depot-widget.html',
  styleUrl: './depot-widget.css',
})
export class DepotWidget {

}

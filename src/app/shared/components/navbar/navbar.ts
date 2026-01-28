import { Component } from '@angular/core';
import { Topbar } from "../topbar/topbar";
import { MiddleHeader } from "../middle-header/middle-header";
import { BottomHeader } from "../bottom-header/bottom-header";

@Component({
  selector: 'app-navbar',
  imports: [Topbar, MiddleHeader, BottomHeader],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

}

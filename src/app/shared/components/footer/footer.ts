import { Component } from '@angular/core';
import { FooterTop } from "../footer-top/footer-top";
import { FooterMiddle } from "../footer-middle/footer-middle";
import { FooterBottom } from "../footer-bottom/footer-bottom";

@Component({
  selector: 'app-footer',
  imports: [FooterTop, FooterMiddle, FooterBottom],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

}

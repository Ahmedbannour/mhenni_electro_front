import { AfterViewInit, Component } from '@angular/core';
import { Banner } from "./components/banner/banner";
import { Products } from "./components/products/products";
import { tns } from 'tiny-slider';
import { CallActions } from "./components/call-actions/call-actions";
import { SecondBanner } from "./components/second-banner/second-banner";
import { ShippingInfo } from "./components/shipping-info/shipping-info";

@Component({
  selector: 'app-home',
  imports: [Banner, Products, CallActions, SecondBanner, ShippingInfo],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {

  ngAfterViewInit() {
    tns({
      container: '.hero-slider',
      slideBy: 'page',
      autoplay: true,
      autoplayButtonOutput: false,
      mouseDrag: true,
      items: 1,
      nav: false,
      controls: true,
      controlsText: [
        '<i class="lni lni-chevron-left"></i>',
        '<i class="lni lni-chevron-right"></i>'
      ],
    });
  }

}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterTop } from './footer-top';

describe('FooterTop', () => {
  let component: FooterTop;
  let fixture: ComponentFixture<FooterTop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterTop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterTop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterMiddle } from './footer-middle';

describe('FooterMiddle', () => {
  let component: FooterMiddle;
  let fixture: ComponentFixture<FooterMiddle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterMiddle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterMiddle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

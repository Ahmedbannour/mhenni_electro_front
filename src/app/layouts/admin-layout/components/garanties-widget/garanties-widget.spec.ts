import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarantiesWidget } from './garanties-widget';

describe('GarantiesWidget', () => {
  let component: GarantiesWidget;
  let fixture: ComponentFixture<GarantiesWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GarantiesWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GarantiesWidget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

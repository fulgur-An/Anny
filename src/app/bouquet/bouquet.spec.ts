import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bouquet } from './bouquet';

describe('Bouquet', () => {
  let component: Bouquet;
  let fixture: ComponentFixture<Bouquet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bouquet],
    }).compileComponents();

    fixture = TestBed.createComponent(Bouquet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

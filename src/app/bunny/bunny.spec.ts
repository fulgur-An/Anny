import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BunnyComponent } from './bunny';

describe('Bunny', () => {
  let component: BunnyComponent;
  let fixture: ComponentFixture<BunnyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BunnyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BunnyComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

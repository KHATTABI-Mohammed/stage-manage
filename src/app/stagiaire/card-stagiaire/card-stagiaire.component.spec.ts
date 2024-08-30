import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardStagiaireComponent } from './card-stagiaire.component';

describe('CardStagiaireComponent', () => {
  let component: CardStagiaireComponent;
  let fixture: ComponentFixture<CardStagiaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardStagiaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardStagiaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

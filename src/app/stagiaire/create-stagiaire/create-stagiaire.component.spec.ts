import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStagiaireComponent } from './create-stagiaire.component';

describe('CreateStagiaireComponent', () => {
  let component: CreateStagiaireComponent;
  let fixture: ComponentFixture<CreateStagiaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateStagiaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStagiaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

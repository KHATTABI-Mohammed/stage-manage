import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteStagiaireComponent } from './delete-stagiaire.component';

describe('DeleteStagiaireComponent', () => {
  let component: DeleteStagiaireComponent;
  let fixture: ComponentFixture<DeleteStagiaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteStagiaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteStagiaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

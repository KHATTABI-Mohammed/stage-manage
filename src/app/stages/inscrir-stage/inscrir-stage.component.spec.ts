import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscrirStageComponent } from './inscrir-stage.component';

describe('InscrirStageComponent', () => {
  let component: InscrirStageComponent;
  let fixture: ComponentFixture<InscrirStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscrirStageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscrirStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

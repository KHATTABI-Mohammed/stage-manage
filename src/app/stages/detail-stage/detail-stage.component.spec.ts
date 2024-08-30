import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailStageComponent } from './detail-stage.component';

describe('DetailStageComponent', () => {
  let component: DetailStageComponent;
  let fixture: ComponentFixture<DetailStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailStageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

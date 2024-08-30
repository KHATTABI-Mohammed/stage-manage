import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStageComponent } from './list-stage.component';

describe('ListStageComponent', () => {
  let component: ListStageComponent;
  let fixture: ComponentFixture<ListStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListStageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

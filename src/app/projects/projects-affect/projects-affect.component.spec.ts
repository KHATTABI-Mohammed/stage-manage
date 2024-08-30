import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsAffectComponent } from './projects-affect.component';

describe('ProjectsAffectComponent', () => {
  let component: ProjectsAffectComponent;
  let fixture: ComponentFixture<ProjectsAffectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsAffectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsAffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

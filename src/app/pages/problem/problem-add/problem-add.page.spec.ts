import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProblemAddPage } from './problem-add.page';

describe('ProblemAddPage', () => {
  let component: ProblemAddPage;
  let fixture: ComponentFixture<ProblemAddPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProblemAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProblemDetailPage } from './problem-detail.page';

describe('ProblemDetailPage', () => {
  let component: ProblemDetailPage;
  let fixture: ComponentFixture<ProblemDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProblemDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

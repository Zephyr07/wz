import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TombolaDetailPage } from './tombola-detail.page';

describe('TombolaDetailPage', () => {
  let component: TombolaDetailPage;
  let fixture: ComponentFixture<TombolaDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TombolaDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

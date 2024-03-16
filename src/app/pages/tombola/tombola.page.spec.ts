import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TombolaPage } from './tombola.page';

describe('TombolaPage', () => {
  let component: TombolaPage;
  let fixture: ComponentFixture<TombolaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TombolaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

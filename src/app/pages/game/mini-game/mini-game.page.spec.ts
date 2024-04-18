import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiniGamePage } from './mini-game.page';

describe('MiniGamePage', () => {
  let component: MiniGamePage;
  let fixture: ComponentFixture<MiniGamePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MiniGamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

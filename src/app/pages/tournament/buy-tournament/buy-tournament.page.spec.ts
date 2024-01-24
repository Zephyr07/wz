import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuyTournamentPage } from './buy-tournament.page';

describe('BuyTournamentPage', () => {
  let component: BuyTournamentPage;
  let fixture: ComponentFixture<BuyTournamentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BuyTournamentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

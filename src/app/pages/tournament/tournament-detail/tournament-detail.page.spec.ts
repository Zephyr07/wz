import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TournamentDetailPage } from './tournament-detail.page';

describe('TournamentDetailPage', () => {
  let component: TournamentDetailPage;
  let fixture: ComponentFixture<TournamentDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TournamentDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

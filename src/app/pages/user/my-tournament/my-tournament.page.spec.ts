import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyTournamentPage } from './my-tournament.page';

describe('MyTournamentPage', () => {
  let component: MyTournamentPage;
  let fixture: ComponentFixture<MyTournamentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MyTournamentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

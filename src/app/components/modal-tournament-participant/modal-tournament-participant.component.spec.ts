import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalTournamentParticipantComponent } from './modal-tournament-participant.component';

describe('ModalTournamentParticipantComponent', () => {
  let component: ModalTournamentParticipantComponent;
  let fixture: ComponentFixture<ModalTournamentParticipantComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTournamentParticipantComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalTournamentParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

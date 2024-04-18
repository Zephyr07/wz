import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-modal-tournament-participant',
  templateUrl: './modal-tournament-participant.component.html',
  styleUrls: ['./modal-tournament-participant.component.scss'],
})
export class ModalTournamentParticipantComponent  implements OnInit {
  objet:any={};

  participants:any=[];
  constructor(
    private api:ApiProvider,
    private modalController : ModalController
  ) { }

  ngOnInit() {
    this.getParticipants(this.objet);
  }

  getParticipants(id){
    const opt = {
      tournament_id:id,
      should_paginate:false,
      _includes:'user'
    };
    this.api.getList('participants',opt).then(d=>{
      this.participants = d;
    })
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}

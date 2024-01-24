import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";
import {AuthProvider} from "../../../providers/auth/auth";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  constructor(
    private api:ApiProvider,
    private auth:AuthProvider
  ) { }

  ngOnInit() {
  }

}

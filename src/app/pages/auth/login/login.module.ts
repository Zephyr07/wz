import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import {TranslateModule} from "@ngx-translate/core";
import {LoadDataModule} from "../../../components/load-data/load-data.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    LoginPageRoutingModule,
    LoadDataModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}

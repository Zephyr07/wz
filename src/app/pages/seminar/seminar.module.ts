import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeminarPageRoutingModule } from './seminar-routing.module';

import { SeminarPage } from './seminar.page';
import {PipeModule} from "../../pipe/pipe.module";
import {TranslateModule} from "@ngx-translate/core";
import {ModalAddSeminarModule} from "../../components/modal-add-seminar/modal-add-seminar.module";
import {OupsInfoModule} from "../../components/oups-info/oups-info.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeminarPageRoutingModule,
    TranslateModule,
    ModalAddSeminarModule,
    PipeModule,
    OupsInfoModule
  ],
  declarations: [SeminarPage]
})
export class SeminarPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {ModalAddSuggestionComponent} from "./modal-add-suggestion.component";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ],
  declarations: [ModalAddSuggestionComponent],
  exports: [ModalAddSuggestionComponent]
})
export class ModalAddSuggestionModule {}

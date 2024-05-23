import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateInvoicePageRoutingModule } from './create-invoice-routing.module';

import {MaskitoDirective} from '@maskito/angular';

import { CreateInvoicePage } from './create-invoice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaskitoDirective,
    CreateInvoicePageRoutingModule
  ],
  declarations: [CreateInvoicePage]
})
export class CreateInvoicePageModule {}

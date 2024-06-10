import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateExpenseReportPageRoutingModule } from './create-expense-report-routing.module';

import { CreateExpenseReportPage } from './create-expense-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateExpenseReportPageRoutingModule
  ],
  declarations: [CreateExpenseReportPage]
})
export class CreateExpenseReportPageModule {}

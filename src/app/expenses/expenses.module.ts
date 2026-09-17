import { NgModule, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { ExpensesPageRoutingModule } from './expenses-routing.module';

import { ExpensesPage } from './expenses.page';
import { ExpensesService } from './expenses.service';
import { NotificationService } from '../shared/services/notification.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    ExpensesPageRoutingModule
  ],
  declarations: [ExpensesPage]
})
export class ExpensesPageModule {}

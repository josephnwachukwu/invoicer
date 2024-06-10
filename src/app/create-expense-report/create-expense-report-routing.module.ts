import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateExpenseReportPage } from './create-expense-report.page';

const routes: Routes = [
  {
    path: '',
    component: CreateExpenseReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateExpenseReportPageRoutingModule {}

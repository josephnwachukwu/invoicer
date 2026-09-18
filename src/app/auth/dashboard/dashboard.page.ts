import { AfterViewInit, Component, DestroyRef, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InvoiceInterface } from '../../invoices/types/invoices.types';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../auth-service.service';
import { RouterModule,Router } from '@angular/router';
import { InvoiceService } from '../../invoice.service';
import { ClientService } from 'src/app/shared/services/client.service';
import { BaseChartDirective } from 'ng2-charts';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    BaseChartDirective
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements AfterViewInit {
  readonly epochInvoicesUrl = 'https://epoch-time.io/invoices';
  @ViewChild('donutChart', { static: false }) donutChartContainer!: ElementRef;
  authService = inject(AuthService)
  invoiceService = inject(InvoiceService)
  clientService = inject(ClientService)
  invoiceTotals!:number;
  router = inject(Router)
  private readonly destroyRef = inject(DestroyRef)
  paidInvoiceTotal = 0
  chartDataLoaded = false

  get outstandingTotal(): number {
    return Math.max(0, (this.invoiceTotals || 0) - this.paidInvoiceTotal);
  }

  get collectionRate(): number {
    return this.invoiceTotals > 0 ? Math.round((this.paidInvoiceTotal / this.invoiceTotals) * 100) : 0;
  }

  get unpaidInvoiceCount(): number {
    return this.invoiceService.invoices().filter((invoice: InvoiceInterface) => !invoice.isPaid).length;
  }

  get intelligenceSummary(): string {
    if (!this.invoiceService.invoices().length) return 'Create your first invoice to unlock cash-flow insights.';
    if (!this.outstandingTotal) return 'Everything is collected. Your invoice balance is clear.';
    return `${this.unpaidInvoiceCount} invoice${this.unpaidInvoiceCount === 1 ? '' : 's'} account for ${this.outstandingTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} outstanding.`;
  }

  cfg: any = {
    type: 'doughnut',
    data: {
      datasets: [{
        //data: [{id: 'Sales', nested: {value: 1500}}, {id: 'Purchases', nested: {value: 500}}]
        data: []
      }],
      labels: [
        'Invoiced',
        'Received',
        'Outstanding'
    ]
    },
    options: {
      plugins: {
        title: {
            display: true,
            text: 'Invoice Summary'
        },
        legend: {
          display: false,
          labels: {
              color: 'rgb(124, 124, 124)',
          },
      }
    },
      parsing: {
        key: 'nested.value'
      }
    }
  }

  pieChartData:any[] = [];

  constructor() { }

  ngAfterViewInit():void {
    this.invoiceService.getInvoices().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.invoiceService.invoices.set(data);
      this.invoiceTotals = this.invoiceService.invoices().reduce((acc:number, inv:InvoiceInterface) => acc + inv.total!, 0)
      this.paidInvoiceTotal = this.invoiceService.invoices().filter((inv:InvoiceInterface)=>inv.isPaid).reduce((acc:number, inv:InvoiceInterface) => acc + inv.total!, 0)
      const dataArray:any = {
        data: [
          {id: 'Paid Invoices', nested: {value: this.paidInvoiceTotal}},
          {id: 'Unpaid Invoices', nested: {value: this.invoiceTotals - this.paidInvoiceTotal}}
        ]
      }
      const labels:any[] = [
        `Invoiced: $ ${this.invoiceTotals.toFixed(2)}`,
        `Received: $ ${this.paidInvoiceTotal.toFixed(2)}`,
        `Outstanding: $ ${(this.invoiceTotals - this.paidInvoiceTotal).toFixed(2)}`
      ]
      this.cfg.data.labels = labels
      this.cfg.data.datasets = [dataArray];
      this.chartDataLoaded = true;
    })

    this.clientService.getClients().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.clientService.clients.set(data);
    })
  }


}

import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InvoiceInterface } from '../../invoices/types/invoices.types';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../auth-service.service';
import { RouterModule,Router } from '@angular/router';
import { InvoiceService } from '../../invoice.service';
import { ClientService } from 'src/app/shared/services/client.service';
import { BaseChartDirective } from 'ng2-charts';


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
export class DashboardPage implements OnInit, AfterViewInit {
  @ViewChild('donutChart', { static: false }) donutChartContainer!: ElementRef;
  authService = inject(AuthService)
  invoiceService = inject(InvoiceService)
  clientService = inject(ClientService)
  invoiceTotals!:number;
  router = inject(Router)
  paidInvoiceTotal = 0
  chartDataLoaded = false

  cfg = {
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

  ngOnInit() {
    console.log('dashboard')
  }


  ngAfterViewInit():void {
    this.invoiceService.getInvoices().subscribe((data) => {
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
      this.cfg.data.datasets.push(dataArray);
      this.chartDataLoaded = true;
    })

    this.clientService.getClients().subscribe((data) => {
      this.clientService.clients.set(data);
    })
  }


}

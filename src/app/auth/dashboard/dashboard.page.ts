import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InvoiceInterface, Invoice } from '../../models/invoice.model';
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

  cfg = {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [{id: 'Sales', nested: {value: 1500}}, {id: 'Purchases', nested: {value: 500}}]
      }],
      labels: [
        'Green',
        'Blue',
        'Grey'
    ]
    },
    options: {
      plugins: {
        title: {
            display: true,
            text: 'Custom Chart Title'
        },
        legend: {
          display: true,
          labels: {
              color: 'rgb(255, 99, 132)'
          }
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
      this.invoiceTotals = this.invoiceService.invoices().reduce((acc:number, inv:Invoice) => acc + inv.total, 0)
      this.paidInvoiceTotal = this.invoiceService.invoices().filter((inv:Invoice)=>inv.isPaid).reduce((acc:number, inv:Invoice) => acc + inv.total, 0)
      this.pieChartData = [
        {name: 'Paid Invoices', value: this.paidInvoiceTotal, color: "#665faac"},
        {name: 'data 2', value: '200', color: "#FFFFFF"}
      ]
    })

    this.clientService.getClients().subscribe((data) => {
      this.clientService.clients.set(data);
    })
  }


}

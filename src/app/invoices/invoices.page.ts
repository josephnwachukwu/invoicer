import { Component, inject, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.page.html',
  styleUrls: ['./invoices.page.scss'],
})
export class InvoicesPage implements OnInit {
  invoiceService = inject(InvoiceService)
  notifications = inject(NotificationService)

  ngOnInit():void {
    this.invoiceService.getInvoices().subscribe((data) => {
      this.invoiceService.invoices.set(data)
    })
  }

  deleteInvoice = (id:string):void => {
    this.invoiceService.deleteInvoice(id).subscribe({
      next: () => {this.invoiceService.deleteInvoice(id)},
      error: (error) => {this.notifications.notify(error.code)}
    })
  }
}

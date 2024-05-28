import { Component, inject, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { NotificationService } from '../notification.service';
import { InvoiceInterface } from '../models/invoice.model';
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

  /**
   * 
   * @param id 
   */
  deleteInvoice = (id:string):void => {
    this.invoiceService.deleteInvoice(id).subscribe({
      next: () => {this.invoiceService.deleteInvoice(id)},
      error: (error) => {this.notifications.notify(error.code)}
    })
  }
  /**
   * 
   * @param invoice 
   */
  updateInvoice = (invoice: InvoiceInterface):void => {
    const id = invoice.id;
    const data = {
      ...invoice,
      isPaid: !invoice.isPaid,
    }
    this.invoiceService.updateInvoice(id, data).subscribe({
      next: () => {this.notifications.notify('Invoice Updated Successfully')},
      error: (error) => {this.notifications.notify(error.code)}
  
    })
  }
}

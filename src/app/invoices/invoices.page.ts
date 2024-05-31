import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { NotificationService } from '../notification.service';
import { InvoiceInterface, Invoice } from '../models/invoice.model';
import { AuthService } from '../auth/auth-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.page.html',
  styleUrls: ['./invoices.page.scss'],
})
export class InvoicesPage implements OnInit, AfterViewInit {
  invoiceService = inject(InvoiceService)
  notifications = inject(NotificationService)
  authService = inject(AuthService)
  invoiceTotals!:number;
  router = inject(Router)
  paidInvoiceTotal = 0

  ngOnInit():void {
    console.log('invoices')
  }

  ngAfterViewInit():void {
    this.invoiceService.getInvoices().subscribe((data) => {
      this.invoiceService.invoices.set(data);
      this.invoiceTotals = this.invoiceService.invoices().reduce((acc:number, inv:Invoice) => acc + inv.total, 0)
      this.paidInvoiceTotal = this.invoiceService.invoices().filter((inv:Invoice)=>inv.isPaid).reduce((acc:number, inv:Invoice) => acc + inv.total, 0)
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

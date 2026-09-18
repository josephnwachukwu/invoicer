import { Component, DestroyRef, inject, AfterViewInit } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { NotificationService } from '../shared/services/notification.service';
import { InvoiceInterface } from './types/invoices.types';

import { AuthService } from '../auth/auth-service.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-invoices',
  standalone: false,
  templateUrl: './invoices.page.html',
  styleUrls: ['./invoices.page.scss'],
})
export class InvoicesPage implements AfterViewInit {
  invoiceService = inject(InvoiceService)
  notifications = inject(NotificationService)
  authService = inject(AuthService)
  invoiceTotals!:number;
  router = inject(Router)
  alertController = inject(AlertController)
  private readonly destroyRef = inject(DestroyRef)
  paidInvoiceTotal = 0
  searchTerm:string = '';
  alertButtons = () => [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => undefined,
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: (data:any) => {
        this.deleteInvoice(data.id)
      },
    },
  ];
  alertInputs = (client:string) => [
    {
      value: client,
      name: 'id',
      cssClass: 'invisible',
      disabled: true
    }
  ]

  async presentAlert(invoiceID:string) {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'Deleting an Invoice is permanent and cannot be reversed',
      buttons: this.alertButtons(),
      inputs: this.alertInputs(invoiceID)
    });

    await alert.present();
  }
  

  ngAfterViewInit():void {
    this.invoiceService.getInvoices().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.invoiceService.invoices.set(data);
      this.invoiceTotals = this.invoiceService.invoices().reduce((acc:number, inv:InvoiceInterface) => acc + inv.total!, 0)
      this.paidInvoiceTotal = this.invoiceService.invoices().filter((inv:InvoiceInterface)=>inv.isPaid).reduce((acc:number, inv:InvoiceInterface) => acc + inv.total!, 0)
    })
  }

  /**
   * 
   * @param id 
   */
  deleteInvoice = (id:string):void => {
    this.invoiceService.deleteInvoice(id).subscribe({
      next: () => this.notifications.notify('Invoice deleted successfully'),
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

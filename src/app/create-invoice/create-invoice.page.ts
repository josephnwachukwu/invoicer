import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges, ViewChild, inject, signal } from '@angular/core';
import { defaultInvoice, InvoiceInterface, defaultLineItem } from '../invoices/types/invoices.types';
import { LineItem } from '../models/lineItem.model'  
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { HttpClient } from '@angular/common/http';
import { InvoiceService } from '../invoice.service';
import { Firestore } from '@angular/fire/firestore';
import { NotificationService } from '../shared/services/notification.service';
import { ClientService } from '../shared/services/client.service';
import { zip, Subscription } from 'rxjs';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.page.html',
  styleUrls: ['./create-invoice.page.scss']
})
export class CreateInvoicePage implements OnInit, OnChanges {
  @ViewChild(IonModal)
  modal!: IonModal;

  invoice!: InvoiceInterface;
	currentUser:any;
	currentClient = '';
  http = inject(HttpClient)
  invoiceService = inject(InvoiceService)
  route = inject(ActivatedRoute)
  processingInvoice = signal<boolean>(false)
  notifications = inject(NotificationService)
  fireStore = inject(Firestore)
  clientService = inject(ClientService)
  router = inject(Router)
  message = 'Please wait for the invoice to open or check your downloads folder'
  pendingMessage = signal<boolean>(false)
  isEdit = false;
  
  ngOnInit() {
    this.invoice === undefined ? this.invoice = {...defaultInvoice, lineItems: {...defaultLineItem}} : console.log('check')
    this.route.queryParamMap.subscribe(params => {
      if(params.get('clientId') !== null) {
        const clientId = params.get('clientId')
        this.clientService.getClientById(clientId!).subscribe({
          next: ({email, address1, address2, city, state, zipcode, phoneNumber, contactName, name}) => { 
            this.invoice.toInfo = `${name}\n${address1} ${address2}\n${city}, ${state}, ${zipcode}\n${phoneNumber}`
          },
          error: (error) => { 
            console.error(error.code); 
            this.notifications.notify(error.code)
          }
        })
      }

      if(params.get('invoiceId') !== null) {
        const invoiceId = params.get('invoiceId')
        this.invoiceService.getInvoiceById(invoiceId).subscribe({
          next: (data) => {
            this.invoice = {...data}
            this.isEdit = true
          },
          error: (error) => { 
            console.error(error.code); 
            this.notifications.notify(error.code)
          }
        })
      }
      
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['invoice']) {
      this.isExistingInvoice();
      console.log('invoice changed')
    }
  }

  // Checks for an existing invoice
  isExistingInvoice() {
    // if (this.invoice === null) {
    //   this.message = 'Input is null';
    // } else {
    //   this.message = 'Input is not null';
    // }
    this.invoice === null ? this.invoice = {...defaultInvoice, lineItems: {...defaultLineItem}} : console.log('there is an existing invoice')
  }

  // Add a new line Item
  addLineItem = () => {
  	this.invoice.lineItems.push({...defaultLineItem})
  }

  // Delete Line Item only if there is more than one
  removeLineItem = (ind:number) => {
    this.invoice.lineItems.length >= 2 ? this.invoice.lineItems.splice(ind,1) : null
    // Recaculate Totals after adjusting Line items
    this.calculate(this.invoice)
  }

  // Recalculate invoice numbers
  calculate = (inv:InvoiceInterface) => {

    // Reset Values
  	inv.subtotal = 0;
  	inv.total = 0;

    // Process Line items amount for subtotal
    inv.lineItems.map((lineItem: any) => lineItem.amount = lineItem.quantity * lineItem.rate);

    // Calculate subtotal based on line Items
    inv.subtotal = inv.lineItems.reduce((total:number, lineItem:any)=> total + lineItem.amount, 0);

    // First add the subtotal
    inv.total = inv.total + inv.subtotal!;

    // Calculate discount
    inv.total = inv.hasDiscount && inv.discount! > 0 ? inv.total - inv.discount! : inv.total;
    
    // Calculate Tax basd on tax Perentage
    inv.total = inv.hasTax && inv.tax! > 0 ? inv.total + (inv.total * (inv.tax! / 100)) : inv.total;
    
    // Calculate Shipping
    inv.total = inv.hasShipping && inv.shipping! > 0 ? inv.total + inv.shipping! : inv.total;

    // Calculate Partial Payment
    inv.total = inv.hasPaidPartial && inv.amountPaid! > 0 ? inv.total - inv.amountPaid! : inv.total;

    this.invoice = inv
  }


  cancel = () =>{
    this.modal.dismiss();
  }

  confirm = () => {
    //this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      console.log('confirmed')
    }
  }

  // Send invoice to firebase for processing
  downloadInvoice = () => {
    this.processingInvoice.set(true)
    // Blob type is required
    const httpOptions = {
      responseType: 'blob' as 'json'
    };

    // save the invoice
    this.invoiceService.createInvoice(this.invoice).then((docRef:any) => {
      console.log('data', docRef.id)

      const stamp = Date.now().toString();
      var fileName = "invoice-" + stamp + ".pdf";
      var a = document.createElement("a");
      document.body.appendChild(a);

      // Headless invoice creation then place in link and invoke click
      this.http.get('https://us-central1-invoicer-6022f.cloudfunctions.net/app/download?url=https://invoicer-6022f.firebaseapp.com/view/' + docRef.id, httpOptions).subscribe((data:any) => {
        const file = new Blob([data], { type: 'application/pdf' });
        const downloadURL = URL.createObjectURL(file);
        a.href = downloadURL;
        a.download = fileName;
        a.click();
      }) ;

    }).then(()=>{
      this.notifications.notify('Invoice processed successfully')
      this.processingInvoice.set(false)
    });
  }

  saveInvoice = (inv:InvoiceInterface) => {
    this.invoiceService.saveInvoice(inv).subscribe({
      next: (data) => {
        this.notifications.notify('Invoice save sucessfully');
        this.router.navigate(['invoices'])
      },
      error: (error) => {
        this.notifications.notify(error.code)
      }
    })
  }

  updateInvoice = (inv:InvoiceInterface) => {
    this.invoiceService.updateInvoice(inv.id!, inv).subscribe({
      next: (data) => {
        this.notifications.notify("Invoice updated successfully")
      },
      error: (error) => {
        this.notifications.notify(error.code)
      }
    })
  }

  emailInvoice = () => {

  }
}

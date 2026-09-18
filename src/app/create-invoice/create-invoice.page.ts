import { Component, DestroyRef, OnInit, OnChanges, SimpleChanges, ViewChild, inject, signal } from '@angular/core';
import { defaultInvoice, InvoiceInterface, defaultLineItem } from '../invoices/types/invoices.types';
import { LineItem } from '../models/lineItem.model'  
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { HttpClient } from '@angular/common/http';
import { InvoiceService } from '../invoice.service';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { NotificationService } from '../shared/services/notification.service';
import { ClientService } from '../shared/services/client.service';
import { AuthService } from '../auth/auth-service.service';
import {MaskitoDirective} from '@maskito/angular';
import {MaskitoOptions} from '@maskito/core';
import { environment } from '../../environments/environment';
import { filter, take, timeout } from 'rxjs';
import { AnalyticsService } from '../shared/services/analytics.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-create-invoice',
  standalone: false,
  templateUrl: './create-invoice.page.html',
  styleUrls: ['./create-invoice.page.scss']
})
export class CreateInvoicePage implements OnInit, OnChanges {
  @ViewChild(IonModal)
  modal!: IonModal;
  authService = inject(AuthService)
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
  analytics = inject(AnalyticsService)
  private readonly destroyRef = inject(DestroyRef)
  message = 'Please wait for the invoice to open or check your downloads folder'
  pendingMessage = signal<boolean>(false)
  isEdit = false;

  readonly currencyMask: MaskitoOptions = {
    mask: /^\d+$/,
  };

  readonly numberMask: MaskitoOptions = {
    mask: /^\d+$/,
  };

  readonly phoneNumberMask: MaskitoOptions = {
    mask: [
      '+',
      '1',
      ' ',
      '(',
      /\d/,
      /\d/,
      /\d/,
      ')',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ],
  };
  
  ngOnInit() {
    const uid = this.authService.currentUser?.uid || '';
    this.invoice === undefined ? this.invoice = {...defaultInvoice, lineItems:[{...defaultLineItem}], uid, ownerId: uid} : undefined

    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      if(params.get('clientId') !== null) {
        const clientId = params.get('clientId')
        this.clientService.getClientById(clientId!).pipe(take(1)).subscribe({
          next: ({email, address1, address2, city, state, zipcode, phoneNumber, contactName, name}) => { 
            this.invoice.toInfo = `${name}\n${address1} ${address2}\n${city}, ${state}, ${zipcode}\n${phoneNumber}`
          },
          error: (error) => { 
            this.notifications.notify(error.code)
          }
        })
      } else {
      }

      if(params.get('invoiceId') !== null) {
        const invoiceId = params.get('invoiceId')
        this.invoiceService.getInvoiceById(invoiceId!).pipe(take(1)).subscribe({
          next: (data) => {
            this.invoice = {...data}
            this.isEdit = true
          },
          error: (error) => { 
            this.notifications.notify(error.code)
          }
        })
      }
      else {
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['invoice']) {
      this.isExistingInvoice();
    }
  }

  // Checks for an existing invoice
  isExistingInvoice() {
    this.invoice === undefined ? this.invoice = {...defaultInvoice, lineItems: [{...defaultLineItem}]} : undefined
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
      const stamp = Date.now().toString();
      var fileName = "invoice-" + stamp + ".pdf";
      var a = document.createElement("a");
      document.body.appendChild(a);

      // Headless invoice creation then place in link and invoke click
      const invoiceUrl = encodeURIComponent(`${environment.appBaseUrl}/view/${docRef.id}`);
      this.http.get(`${environment.functionBaseUrl}/download?url=${invoiceUrl}`, httpOptions).subscribe({ next: (data:any) => {
        const file = new Blob([data], { type: 'application/pdf' });
        const downloadURL = URL.createObjectURL(file);
        a.href = downloadURL;
        a.download = fileName;
        a.click();
        a.remove();
        URL.revokeObjectURL(downloadURL);
        this.analytics.track('download', { file_type: 'pdf', theme: this.invoice.theme || 'classic' });
        this.notifications.notify('Invoice downloaded successfully.');
        this.processingInvoice.set(false);
      }, error: () => {
        a.remove();
        this.processingInvoice.set(false);
        this.notifications.notify('The PDF could not be generated. Please try again.');
      }});
    }).catch(() => {
      this.processingInvoice.set(false);
      this.notifications.notify('The invoice could not be saved.');
    });
  }

  saveInvoice = (inv:InvoiceInterface, action:string) => {
    this.processingInvoice.set(true)
    this.invoiceService.saveInvoice({...inv, action}).subscribe({
      next: (data) => {
        if(data) {
          docData(doc(this.fireStore, 'invoices', data.id)).pipe(
            filter(invoiceData => Boolean(invoiceData?.['downloadUrl'])),
            take(1),
            timeout(120000),
          ).subscribe({ next: () => {
                this.notifications.notify('Invoice Created Successfully!')
                this.processingInvoice.set(false)
                this.modal.dismiss(null, 'done');
                this.router.navigate(['/invoices'])
          }, error: () => {
            this.processingInvoice.set(false);
            this.notifications.notify('Invoice saved, but PDF generation is taking longer than expected.');
          }});
        }
      },
      error: (error) => {
        this.notifications.notify(error.code)
        this.processingInvoice.set(false)
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
    const user = this.authService.currentUser;
    if (!user || !this.invoice.recipientEmail) {
      this.notifications.notify('Add a recipient email before sending.');
      return;
    }
    this.processingInvoice.set(true);
    user.getIdToken().then(token => this.http.post(`${environment.functionBaseUrl}/emailInvoice`, this.invoice, {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe({
      next: () => {
        this.processingInvoice.set(false);
        this.analytics.track('invoice_sent', { theme: this.invoice.theme || 'classic' });
        this.notifications.notify('Invoice sent successfully.');
      },
      error: () => {
        this.processingInvoice.set(false);
        this.notifications.notify('Invoice delivery failed. Please try again.');
      },
    }));
  }
}

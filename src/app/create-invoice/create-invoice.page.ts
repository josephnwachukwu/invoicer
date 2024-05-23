import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Invoice } from '../models/invoice.model'
import { LineItem } from '../models/lineItem.model'
//import { AuthService } from '../../auth/auth.service'; 
import { AngularFireAuth } from '@angular/fire/compat/auth';
//import { AngularFirestore } from '@angular/fire/compat/firestore';    
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { MaskitoModule } from '@maskito/angular';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.page.html',
  styleUrls: ['./create-invoice.page.scss'],
})
export class CreateInvoicePage implements OnInit, OnChanges {
  @ViewChild(IonModal)
  modal!: IonModal;

  @Input() invoice!: Invoice;
	//profile$: Observable<any>;
	currentUser:any;
	//clientId:string;
	currentClient:any;
  constructor(/* public afauth: AngularFireAuth, public firestore: AngularFirestore,*/ private route: ActivatedRoute) {
    //console.log('user data from create', this.auth.userDataJson)
     }

  ngOnInit() {
    console.log('testing')
    this.invoice === undefined ? this.invoice = new Invoice() : console.log('check')
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
    this.invoice === null ? this.invoice = new Invoice() : console.log('there is an existing invoice')
  }

  // Add a new line Item
  addLineItem = () => {
  	this.invoice.lineItems.push(new LineItem())
  }

  // Delete Line Item only if there is more than one
  removeLineItem = (ind:number) => {
    this.invoice.lineItems.length >= 2 ? this.invoice.lineItems.splice(ind,1) : null
    // Recaculate Totals after adjusting Line items
    this.calculate(this.invoice)
  }

  // Recalculate invoice numbers
  calculate = (inv:Invoice) => {

    // Reset Values
  	inv.subtotal = 0;
  	inv.total = 0;

    // Process Line items amount for subtotal
    inv.lineItems.map((lineItem: any) => lineItem.amount = lineItem.quantity * lineItem.rate);

    // Calculate subtotal based on line Items
    inv.subtotal = inv.lineItems.reduce((total:number, lineItem:any)=> total + lineItem.amount, 0);

    // First add the subtotal
    inv.total = inv.total + inv.subtotal;

    // Calculate discount
    inv.total = inv.hasDiscount && inv.discount > 0 ? inv.total - inv.discount : inv.total;
    
    // Calculate Tax basd on tax Perentage
    inv.total = inv.hasTax && inv.tax > 0 ? inv.total + (inv.total * (inv.tax / 100)) : inv.total;
    
    // Calculate Shipping
    inv.total = inv.hasShipping && inv.shipping > 0 ? inv.total + inv.shipping : inv.total;

    // Calculate Partial Payment
    inv.total = inv.hasPaidPartial && inv.amountPaid > 0 ? inv.total - inv.amountPaid : inv.total;

    this.invoice = inv
  }


  cancel() {
    this.modal.dismiss();
  }

  confirm() {
    //this.modal.dismiss(this.name, 'confirm');

  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      console.log('confirmed')
    }
  }

}

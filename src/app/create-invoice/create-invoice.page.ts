import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Invoice } from '../models/invoice.model'
import { LineItem } from '../models/lineItem.model'
//import { AuthService } from '../../auth/auth.service'; 
import { AngularFireAuth } from '@angular/fire/compat/auth';
//import { AngularFirestore } from '@angular/fire/compat/firestore';    
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.page.html',
  styleUrls: ['./create-invoice.page.scss'],
})
export class CreateInvoicePage implements OnInit, OnChanges {
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
    console.log('invoice', this.invoice)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['invoice']) {
      this.isExistingInvoice();
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

  addLineItem = () => {
  	//let lineItem = new LineItem()
  	this.invoice.lineItems.push(new LineItem())
  }

  removeLineItem = (ind:number) => {
  	// if(this.invoice.lineItems.length >= 2) {
  	// 	this.invoice.lineItems.splice(ind,1)
  	// }
    this.invoice.lineItems.length >= 2 ? this.invoice.lineItems.splice(ind,1) : null
  }

  updateLineItem(ind:number) {
  	this.invoice.lineItems[ind].quantity = parseInt(this.invoice.lineItems[ind].quantity)
  	this.invoice.lineItems[ind].rate = parseInt(this.invoice.lineItems[ind].rate)
  	this.invoice.lineItems[ind].amount = parseInt(this.invoice.lineItems[ind].quantity) * parseInt(this.invoice.lineItems[ind].rate)
  	//console.log(parseInt(this.invoice.lineItems[ind].amount))
  	this.updateTrueTotal()
  }

  // Recalculate Everything
  updateTrueTotal() {
  	this.invoice.subtotal = 0
  	this.invoice.total = 0;

  	for(let i in this.invoice.lineItems) {
  		this.invoice.subtotal += parseInt(this.invoice.lineItems[i].amount)
  		this.invoice.total = this.invoice.subtotal
  	}

  	if(this.invoice.hasTax && this.invoice.tax > 0) {
  		let taxAmt = this.invoice.total * (this.invoice.tax / 100)
  		this.invoice.total = this.invoice.total + taxAmt
  	}
  	if(this.invoice.hasDiscount && this.invoice.discount > 0) {
  		this.invoice.total = this.invoice.total - this.invoice.discount
  	}

  	if(this.invoice.hasPaidPartial && this.invoice.amountPaid > 0) {
  		this.invoice.total = this.invoice.total - this.invoice.amountPaid
  	}

  	if(this.invoice.hasShipping && this.invoice.shipping > 0) {
  		this.invoice.total = this.invoice.total + this.invoice.amountPaid
  	}

  }

}

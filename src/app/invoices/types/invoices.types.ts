// export type Invoice = {
//     lineItems?: any
	
// 	notes?: string
// 	terms?: string

// 	invoiceNo?: string

// 	fromInfo?: string
// 	toInfo?: string

// 	hasPurchaseOrderNo?: boolean
// 	purchaseOrderNo?: string

// 	hasDiscount?: boolean
// 	discount?: number

// 	hasTax?: boolean
// 	tax?: number

// 	due?: string

// 	date?:string

// 	businessEmail?:string
// 	clientEmail?:string
// 	clientId?:string
// 	client?:any;

// 	recipientName?:string;
// 	recipientEmail?:string
// 	recipientMessage?:string

// 	location?: string
// 	filename?: string

// 	senderName?:string

// 	hasPaidPartial?: boolean
// 	amountPaid?: number

// 	hasShipping?: boolean
// 	shipping?: number

// 	subtotal?: number

// 	total?: number
// 	isPaid?: boolean
// 	id?:any;

// 	currentTheme?:string
// 	hasBusinessLogo?:boolean
// 	logoLocation?:string
// }
  
export interface InvoiceInterface {
	uid?:string
	lineItems?: any
	
	notes?: string
	terms?: string

	invoiceNo?: string

	fromInfo?: string
	toInfo?: string

	hasPurchaseOrderNo?: boolean
	purchaseOrderNo?: string

	hasDiscount?: boolean
	discount?: number

	hasTax?: boolean
	tax?: number

	due?: string

	date?:string

	businessEmail?:string
	clientEmail?:string
	clientId?:string
	client?:any;

	recipientName?:string;
	recipientEmail?:string
	recipientMessage?:string

	location?: string
	filename?: string

	senderName?:string

	hasPaidPartial?: boolean
	amountPaid?: number

	hasShipping?: boolean
	shipping?: number

	subtotal?: number

	total?: number
	isPaid?: boolean
	id?:any;

	currentTheme?:string
	hasBusinessLogo?:boolean
	logoLocation?:string

	downloadUrl?: string
	action?: string
}

export const defaultInvoice = {
		
		notes: '',
		terms: '',
		
		invoiceNo: '',
		due: '',

		fromInfo: '',
		toInfo: '',

		hasPurchaseOrderNo: false,
		purchaseOrderNo: '',


		hasDiscount: false,
		discount: 0,

		hasTax: false,
		tax: 0.00,

		hasPaidPartial:  false,
		amountPaid: 0,

		hasShipping: false,
		shipping: 0,

		subtotal: 0,

		total: 0,

		date: new Date().toDateString(),
		isPaid: false,
		hasBusinessLogo: false,
}

export interface LineItem {
    name:string
	quantity:number
	rate:number
	amount:number
}

export const defaultLineItem = {
        name: '',
		quantity: 0,
		rate: 0,
		amount: 0.00
}
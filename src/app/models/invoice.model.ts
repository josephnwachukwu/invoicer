import { LineItem }  from './lineItem.model'

export class Invoice {
	id?:string;
	lineItems: LineItem[] = []
	
	notes: string
	terms: string

	invoiceNo: string

	fromInfo: string
	toInfo: string

	hasPurchaseOrderNo: boolean
	purchaseOrderNo: string

	hasDiscount: boolean
	discount: number

	hasTax: boolean
	tax: number

	due: string

	date:string

	businessEmail?:string
	clientEmail?:string
	clientId?:string
	client?:any;

	recipientEmail?:string
	recipientMessage?:string
	recipientName?:string

	location?: string
	filename?: string

	senderName?:string

	hasPaidPartial: boolean
	amountPaid: number

	hasShipping: boolean
	shipping: number

	subtotal: number

	total: number
	isPaid: boolean

	currentTheme?:string
	hasBusinessLogo:boolean
	logoLocation?:string


	constructor() {
		let lineItem = new LineItem()
		
		this.notes = ''
		this.terms = ''
		
		this.invoiceNo = ''
		this.due = ''

		this.fromInfo = ''
		this.toInfo = ''

		this.hasPurchaseOrderNo = false
		this.purchaseOrderNo = ""

		this.lineItems.push(lineItem)

		this.hasDiscount = false
		this.discount = 0

		this.hasTax = false
		this.tax = 0.00

		this.hasPaidPartial =  false
		this.amountPaid = 0;

		this.hasShipping = false
		this.shipping = 0

		this.subtotal = 0

		this.total = 0.00

		this.date = new Date().toDateString()
		this.isPaid = false;
		this.hasBusinessLogo = false;
	}
}


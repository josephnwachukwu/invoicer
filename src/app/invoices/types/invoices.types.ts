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
	schemaVersion?: 2
	documentType?: 'invoice' | 'estimate'
	status?: 'draft' | 'sent' | 'viewed' | 'partially_paid' | 'paid' | 'overdue' | 'void'
	ownerId?: string
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
	theme?: string
	hasBusinessLogo?:boolean
	logoLocation?:string
	companyLogo?: string
	companyLogoName?: string
	currency?: string
	locale?: string
	dueDate?: string
	attachments?: unknown[]
	teamMemberIds?: string[]
	workspaceId?: string
	hostedToken?: string
	publicAccess?: { enabled: boolean; shareToken: string }
	branding?: { accentColor: string; hideInvoicerBranding: boolean }
	analytics?: { viewCount: number; firstViewedAt: string; lastViewedAt: string; paidAt: string }
	createdAt?: unknown
	updatedAt?: unknown

	downloadUrl?: string
	action?: string
}

export const defaultInvoice = {
		schemaVersion: 2 as const,
		documentType: 'invoice' as const,
		status: 'draft' as const,
		ownerId: '',
		
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
		theme: 'classic',
		currentTheme: 'classic',
		companyLogo: '',
		companyLogoName: '',
		currency: 'USD',
		locale: 'en-US',
		dueDate: '',
		attachments: [],
		teamMemberIds: [],
		workspaceId: '',
		hostedToken: '',
		publicAccess: { enabled: true, shareToken: '' },
		branding: { accentColor: '#2563eb', hideInvoicerBranding: false },
		analytics: { viewCount: 0, firstViewedAt: '', lastViewedAt: '', paidAt: '' },
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

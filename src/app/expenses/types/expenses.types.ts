/**
 * Expense Interfaces
 */

export interface ExpenseReport {
    id?: string; // Document ID
    uid?: string; // Firebase User ID
    employeeName?: string;
    name?: string;
    description?: string;
    reason?:string;
    lineItems?: LineItem[];
    date?: string;
    reportNo?: ReportNo;
    totalAmount?: number;
    reimbursableAmount?: number;
    advanceAmount?: number;
    status?: StatusEnum;
    company?: Company;
    address?: string; // temporary 

    hasEmployeeId?: Boolean;
    employeeId?: string;
    hasManager?: Boolean;
    managerName?: string;
    hasDepartment?: Boolean;
    department?: string;

}
export enum StatusEnum {
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
    PENDING = 'Pending',
    DRAFT = 'Draft',
    RECONCILED = 'Reconciled'
}

export const defaultExpenseReport:ExpenseReport = {
    totalAmount: 0,
    reimbursableAmount: 0,
    advanceAmount: 0,
    status: StatusEnum.DRAFT,
    hasEmployeeId: false,
    hasManager: false,
    hasDepartment: false
}

export interface LineItem {
    name?: string;
    category?: string;
    vendor?: string;
    account?: string;
    subtotal: number;
    tax: number;
    total: number;
    notes: string;
    date?: string;
}

export const defaultLineItem:LineItem  = {
    name: '',
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: ''
}



export enum CategoriesEnum {
    GENERAL = 'General Expenses',
    TRAVEL = 'Travel (general)',
    FOOD = 'Food (General)',
    LODGING = 'Hotel and Stay',
    FLIGHT = 'Flight',
    LUNCH = 'Lunch',
    DINNER = 'Dinner',
    EQUIPMENT = 'Equipment',
    SUBSCRIPTIONS = 'Subscriptions',
    INSURANCE = 'Insurance',
    TRAINING = 'Training',
    SUPPLIES = 'Office Supplies',
    DEPRECIATION = 'Depreciation',
    ADVERTISING = 'Advertising',
    EDUCATION = 'Education',
    LICENSING = 'Licensing',
    UTILITIES = 'Utilities',
    REPAIRS = 'Repairs',
    INTEREST = 'Interest',
    RENT = 'Rent',
    OTHER = 'Other'
}

export const categoriesList = [
   { name:'General Expenses', value: 'General Expenses'},
   { name:'Travel (general)', value: 'Travel (general)'},
   { name:'Food (General)', value: 'Food (General)'},
   { name:'Hotel and Stay', value: 'Hotel and Stay'},
   { name:'Flight', value: 'Flight'},
   { name:'Lunch', value: 'Lunch'},
   { name:'Dinner', value: 'Dinner'},
   { name:'Equipment', value: 'Equipment'},
   { name:'Subscriptions', value: 'Subscriptions'},
   { name:'Insurance', value: 'Insurance'},
   { name:'Training', value: 'Training'},
   { name:'Office Supplies', value: 'Office Supplies'},
   { name:'Depreciation', value: 'Depreciation'},
   { name:'Advertising', value: 'Advertising'},
   { name:'Education', value: 'Education'},
   { name:'Licensing', value: 'Licensing'},
   { name:'Utilities', value: 'Utilities'},
   { name:'Repairs', value: 'Repairs'},
   { name:'Interest', value: 'Interest'},
   { name:'Rent', value: 'Rent'},
   { name: 'Other', value: 'Other'}
]

interface Address {
    address1?: string;
    address2?: string;
    city: string;
    state: string;
    zipcode: number;
}

interface Company {
    name: string;
    address: Address;
}

type ReportNo = string
export type Address = {
    addressType: 'office' | 'billing' | 'residental' //radio enum
    name:string 
    address1?:string;
    address2?:string;
    city?:string;
    state?:string;
    zipCode?:number;
    number?:PhoneNumber;
}

export interface AddressInterface {
    addressType: 'office' | 'billing' | 'residental' //radio enum
    name:string 
    address1?:string;
    address2?:string;
    city?:string;
    state?:string;
    zipCode?:number;
    number?:PhoneNumber;
}


export type PhoneNumber = {
    numberType: 'mobile' | 'home' | 'office'
    phoneNumber?:number
}

// Default Phone Number object for initialization
export const defaultPhoneNumber:PhoneNumber = {
    numberType: 'mobile',
}

// Default address object for initialization
export const defaultAddress:Address = {
    addressType: 'residental',
    name:'default',
    number: {...defaultPhoneNumber}
}
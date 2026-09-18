export interface UserProfile {
  id?:string;
  uid?: string;
  displayName?: string;
  photoURL?: string;
  email?: string;
  businessName?: string;
  businessAddress1?: string;
  businessAddress2?: string;
  businessCity?: string;
  businessState?: string;
  businessZip?: string;
  businessPhone?: string;
  tier?: 'basic' | 'premium'
  hasCompanyLogo?: boolean;
  companyLogoUrl?: string;
  hasTutorialsEnabled?: boolean;
  businessType?: string;
  taxNo?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export const defaultUserProfile: UserProfile = {
  tier: 'basic',
  hasTutorialsEnabled: true,
  businessType: 'Independedent Contractor',
  photoURL: 'https://ionicframework.com/docs/img/demos/avatar.svg'
}

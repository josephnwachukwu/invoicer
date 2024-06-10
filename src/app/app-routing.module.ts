import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard'
/**
 * Redirects Unauthorozed users to logn
 * @returns 
 */
const redirectUnauthorizeToLogin = () => redirectUnauthorizedTo('');
/**
 * Redirects users to dashboard of they are logged in 
 * @returns 
 */
const redirectLoggedInToHome = () => redirectLoggedInTo(['dashboard'])

const routes: Routes = [
  {
    path: 'create-invoice',
    loadChildren: () => import('./create-invoice/create-invoice.module').then( m => m.CreateInvoicePageModule),
    ...canActivate(redirectUnauthorizeToLogin)

  },
  {
    path: 'view-invoice',
    loadChildren: () => import('./view-invoice/view-invoice.module').then( m => m.ViewInvoicePageModule)
  },
  {
    path: '',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./auth/dashboard/dashboard.page').then( m => m.DashboardPage),
    ...canActivate(redirectUnauthorizeToLogin)
  },
  {
    path: 'profile',
    loadChildren: () => import('./auth/profile/profile.module').then( m => m.ProfilePageModule),
    ...canActivate(redirectUnauthorizeToLogin)
  },
  {
    path: 'invoices',
    loadChildren: () => import('./invoices/invoices.module').then( m => m.InvoicesPageModule),
    ...canActivate(redirectUnauthorizeToLogin)
  },
  {
    path: 'projects',
    loadChildren: () => import('./projects/projects.module').then( m => m.ProjectsPageModule),
    ...canActivate(redirectUnauthorizeToLogin)
  },
  {
    path: 'expenses',
    loadChildren: () => import('./expenses/expenses.module').then( m => m.ExpensesPageModule),
    ...canActivate(redirectUnauthorizeToLogin)
  },
  {
    path: 'clients',
    loadChildren: () => import('./clients/clients.module').then( m => m.ClientsPageModule),
    ...canActivate(redirectUnauthorizeToLogin)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'forgotpassword',
    loadChildren: () => import('./auth/forgotpassword/forgotpassword.module').then( m => m.ForgotpasswordPageModule)
  },
  {
    path: 'create-expense-report',
    loadChildren: () => import('./create-expense-report/create-expense-report.module').then( m => m.CreateExpenseReportPageModule),
    ...canActivate(redirectUnauthorizeToLogin)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

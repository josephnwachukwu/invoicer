import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { CreateInvoicePage } from './create-invoice.page';
import { CreateInvoicePageModule } from './create-invoice.module';
import { AuthService } from '../auth/auth-service.service';
import { InvoiceService } from '../invoice.service';
import { ClientService } from '../shared/services/client.service';
import { NotificationService } from '../shared/services/notification.service';
import { AnalyticsService } from '../shared/services/analytics.service';
import { Firestore } from '@angular/fire/firestore';

describe('CreateInvoicePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateInvoicePageModule],
      providers: [
        { provide: AuthService, useValue: { currentUser: { uid: 'user-1' } } },
        { provide: InvoiceService, useValue: { createInvoice: jasmine.createSpy(), getInvoiceById: () => of({}) } },
        { provide: ClientService, useValue: { getClientById: () => of({}) } },
        { provide: NotificationService, useValue: { notify: jasmine.createSpy() } },
        { provide: AnalyticsService, useValue: { track: jasmine.createSpy() } },
        { provide: HttpClient, useValue: { get: jasmine.createSpy(), post: jasmine.createSpy() } },
        { provide: Firestore, useValue: {} },
        { provide: Router, useValue: { navigate: jasmine.createSpy() } },
        { provide: ActivatedRoute, useValue: { queryParamMap: of({ get: () => null }) } },
      ],
    }).compileComponents();
  });

  it('calculates invoice totals', () => {
    const component = TestBed.createComponent(CreateInvoicePage).componentInstance;
    component.ngOnInit();
    component.invoice.lineItems = [{ name: 'Service', quantity: 2, rate: 50, amount: 0 }];
    component.invoice.hasTax = true;
    component.invoice.tax = 10;
    component.calculate(component.invoice);
    expect(component.invoice.total).toBe(110);
  });
});

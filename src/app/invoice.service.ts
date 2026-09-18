import { Injectable, inject, signal } from '@angular/core';
import { AuthService } from './auth/auth-service.service';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, query, serverTimestamp, updateDoc, where } from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { Invoice } from './models/invoice.model';
import { InvoiceInterface } from './invoices/types/invoices.types';
import { AnalyticsService } from './shared/services/analytics.service';
import { omitUndefined } from './shared/utils/firestore-data';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private readonly authService = inject(AuthService);
  private readonly firestore = inject(Firestore);
  private readonly analytics = inject(AnalyticsService);
  private readonly invoiceCollection = collection(this.firestore, 'invoices');
  readonly invoices = signal<InvoiceInterface[]>([]);

  getInvoices(): Observable<InvoiceInterface[]> {
    const uid = this.requireUid();
    return collectionData(query(this.invoiceCollection, where('ownerId', '==', uid)), { idField: 'id' }) as Observable<InvoiceInterface[]>;
  }

  deleteInvoice(invoiceId: string): Observable<void> {
    return from(deleteDoc(doc(this.firestore, 'invoices', invoiceId)));
  }

  updateInvoice(invoiceId: string, data: InvoiceInterface): Observable<void> {
    const { id: _id, ownerId: _ownerId, ...changes } = data;
    return from(updateDoc(doc(this.firestore, 'invoices', invoiceId), omitUndefined({ ...changes, updatedAt: serverTimestamp() })));
  }

  createInvoice(invoice: InvoiceInterface): Promise<any> {
    const uid = this.requireUid();
    const hostedToken = invoice.hostedToken || crypto.randomUUID();
    const payload = this.normalize(invoice, uid, hostedToken);
    return addDoc(this.invoiceCollection, payload).then(result => {
      this.analytics.track('invoice_created', { document_type: payload.documentType, theme: payload.theme });
      this.analytics.trackFirstInvoice(uid);
      return result;
    });
  }

  getInvoiceById(id: string): Observable<Invoice> {
    return docData(doc(this.firestore, 'invoices', id), { idField: 'id' }) as Observable<Invoice>;
  }

  saveInvoice(invoice: InvoiceInterface): Observable<any> {
    return from(this.createInvoice(invoice));
  }

  private normalize(invoice: InvoiceInterface, uid: string, hostedToken: string) {
    const { id: _id, ...invoiceData } = invoice;
    const lineItems = (invoice.lineItems || []).slice(0, 200).map((item: any) => ({
      name: String(item.name || ''),
      quantity: Number(item.quantity) || 0,
      rate: Number(item.rate) || 0,
      amount: Number(item.amount) || 0,
    }));
    return omitUndefined({
      ...invoiceData,
      schemaVersion: 2,
      documentType: invoice.documentType || 'invoice',
      status: invoice.status || 'draft',
      ownerId: uid,
      uid,
      currency: invoice.currency || 'USD',
      locale: invoice.locale || 'en-US',
      theme: invoice.theme || invoice.currentTheme || 'classic',
      lineItems,
      attachments: invoice.attachments || [],
      teamMemberIds: invoice.teamMemberIds || [],
      publicAccess: { enabled: true, shareToken: hostedToken },
      hostedToken,
      companyLogo: invoice.companyLogo || '',
      branding: invoice.branding || { accentColor: '#2563eb', hideInvoicerBranding: false },
      analytics: invoice.analytics || { viewCount: 0, firstViewedAt: '', lastViewedAt: '', paidAt: '' },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  private requireUid(): string {
    const uid = this.authService.currentUser?.uid;
    if (!uid) throw new Error('Authentication required.');
    return uid;
  }
}

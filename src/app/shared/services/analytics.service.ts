import { Injectable } from '@angular/core';
import { Analytics, getAnalytics, isSupported, logEvent } from 'firebase/analytics';
import { getApp } from 'firebase/app';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private analytics?: Analytics;
  private readonly pending: Array<{ name: string; parameters: Record<string, string | number | boolean> }> = [];

  constructor() {
    isSupported().then(supported => {
      if (!supported) return;
      this.analytics = getAnalytics(getApp());
      this.pending.splice(0).forEach(event => logEvent(this.analytics!, event.name, event.parameters));
    }).catch(() => undefined);
  }

  track(name: string, parameters: Record<string, string | number | boolean> = {}): void {
    if (this.analytics) logEvent(this.analytics, name, parameters);
    else this.pending.push({ name, parameters });
  }

  trackFirstInvoice(uid: string): void {
    const key = `invoicer_first_invoice_${uid}`;
    try {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, '1');
    } catch { /* analytics must not interrupt invoicing */ }
    this.track('first_invoice');
  }
}

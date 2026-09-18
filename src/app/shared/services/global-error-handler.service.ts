import { ErrorHandler, Injectable, inject, isDevMode } from '@angular/core';
import { AnalyticsService } from './analytics.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly analytics = inject(AnalyticsService);

  handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    this.analytics.track('app_error', { message: message.slice(0, 100) });
    if (isDevMode()) console.error(error);
  }
}

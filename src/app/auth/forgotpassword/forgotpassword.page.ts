import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth-service.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-forgotpassword',
  standalone: false,
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage {
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  private readonly formBuilder = inject(FormBuilder);
  readonly sending = signal(false);
  readonly form = this.formBuilder.nonNullable.group({ email: ['', [Validators.required, Validators.email]] });

  submit(): void {
    if (this.form.invalid) return;
    this.sending.set(true);
    this.auth.sendPasswordReset(this.form.controls.email.value).subscribe({
      next: () => {
        this.sending.set(false);
        this.notifications.notify('If that account exists, a reset link has been sent.');
      },
      error: () => {
        this.sending.set(false);
        this.notifications.notify('We could not send the reset email. Please try again.');
      },
    });
  }
}

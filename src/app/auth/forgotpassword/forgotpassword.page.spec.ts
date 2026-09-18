import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ForgotpasswordPage } from './forgotpassword.page';
import { ForgotpasswordPageModule } from './forgotpassword.module';
import { AuthService } from '../auth-service.service';
import { NotificationService } from '../../shared/services/notification.service';
import { provideRouter } from '@angular/router';

describe('ForgotpasswordPage', () => {
  it('submits a valid reset request', async () => {
    const sendPasswordReset = jasmine.createSpy().and.returnValue(of(undefined));
    await TestBed.configureTestingModule({
      imports: [ForgotpasswordPageModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { sendPasswordReset } },
        { provide: NotificationService, useValue: { notify: jasmine.createSpy() } },
      ],
    }).compileComponents();
    const component = TestBed.createComponent(ForgotpasswordPage).componentInstance;
    component.form.setValue({ email: 'user@example.com' });
    component.submit();
    expect(sendPasswordReset).toHaveBeenCalledWith('user@example.com');
  });
});

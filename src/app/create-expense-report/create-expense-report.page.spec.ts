import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CreateExpenseReportPage } from './create-expense-report.page';
import { CreateExpenseReportPageModule } from './create-expense-report.module';
import { AuthService } from '../auth/auth-service.service';
import { ExpensesService } from '../expenses/expenses.service';
import { NotificationService } from '../shared/services/notification.service';
import { Firestore } from '@angular/fire/firestore';

describe('CreateExpenseReportPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateExpenseReportPageModule],
      providers: [
        { provide: AuthService, useValue: { currentUser: { uid: 'user-1' } } },
        { provide: ExpensesService, useValue: {} },
        { provide: NotificationService, useValue: { notify: jasmine.createSpy() } },
        { provide: Firestore, useValue: {} },
        { provide: Router, useValue: { navigate: jasmine.createSpy() } },
      ],
    }).compileComponents();
  });

  it('calculates expense totals', () => {
    const component = TestBed.createComponent(CreateExpenseReportPage).componentInstance;
    component.ngAfterViewInit();
    component.expenseReport.lineItems = [{ total: 75 }, { total: 25 }];
    component.calculate(component.expenseReport);
    expect(component.expenseReport.totalAmount).toBe(100);
  });
});

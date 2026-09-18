import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ExpensesPage } from './expenses.page';
import { ExpensesPageModule } from './expenses.module';
import { ExpensesService } from './expenses.service';
import { NotificationService } from '../shared/services/notification.service';
import { provideRouter } from '@angular/router';

describe('ExpensesPage', () => {
  it('loads expense reports', async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesPageModule],
      providers: [
        provideRouter([]),
        { provide: ExpensesService, useValue: { getExpenses: () => of([]), expensesList: { set: jasmine.createSpy() } } },
        { provide: NotificationService, useValue: { notify: jasmine.createSpy() } },
      ],
    }).compileComponents();
    const component = TestBed.createComponent(ExpensesPage).componentInstance;
    component.ngAfterViewInit();
    expect(component).toBeTruthy();
  });
});

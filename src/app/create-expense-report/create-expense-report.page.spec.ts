import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateExpenseReportPage } from './create-expense-report.page';

describe('CreateExpenseReportPage', () => {
  let component: CreateExpenseReportPage;
  let fixture: ComponentFixture<CreateExpenseReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExpenseReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewInvoicePage } from './view-invoice.page';

describe('ViewInvoicePage', () => {
  let component: ViewInvoicePage;
  let fixture: ComponentFixture<ViewInvoicePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInvoicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

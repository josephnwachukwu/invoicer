import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateInvoicePage } from './create-invoice.page';

describe('CreateInvoicePage', () => {
  let component: CreateInvoicePage;
  let fixture: ComponentFixture<CreateInvoicePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInvoicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

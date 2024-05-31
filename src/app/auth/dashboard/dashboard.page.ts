import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InvoiceInterface, Invoice } from '../../models/invoice.model';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../auth-service.service';
import { InvoiceService } from '../../invoice.service';
import { ClientService } from 'src/app/client.service';
import { Router } from '@angular/router';
import * as d3 from 'd3';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    IonicModule,
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, AfterViewInit {
  @ViewChild('donutChart', { static: false }) donutChartContainer!: ElementRef;
  authService = inject(AuthService)
  invoiceService = inject(InvoiceService)
  clientService = inject(ClientService)
  invoiceTotals!:number;
  router = inject(Router)
  paidInvoiceTotal = 0

  //d3 settings
  width:number = 256
  height:number =  256
  private svg: any;
  private colors: any;
  private radius = Math.min(this.width, this.height);

  pieChartData:any[] = [];

  constructor() { }

  ngOnInit() {
    this.invoiceService.getInvoices().subscribe((data) => {
      this.invoiceService.invoices.set(data);
      this.invoiceTotals = this.invoiceService.invoices().reduce((acc:number, inv:Invoice) => acc + inv.total, 0)
      this.paidInvoiceTotal = this.invoiceService.invoices().filter((inv:Invoice)=>inv.isPaid).reduce((acc:number, inv:Invoice) => acc + inv.total, 0)
      this.pieChartData = [
        {name: 'Paid Invoices', value: this.paidInvoiceTotal, color: "#665faac"},
        {name: 'data 2', value: '200', color: "#FFFFFF"}
      ]
    })
  }


  ngAfterViewInit():void {
    this.renderChart()
  }

  renderChart = () => {
    const container = this.donutChartContainer.nativeElement;
    const width = 256;
    const height = 256;
    //d3.select("svg").remove(); // Clear previous chart
    
    const svg = d3.select(container).append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);
    
    const radius = Math.min(width, height) / 2;
    
    // Create color scale based on data's color property
    const color = d3.scaleOrdinal()
      .domain(this.pieChartData.map(d => d.color))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), this.pieChartData.length).reverse());
    
    const arc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);
    
    const pie = d3.pie<any>()
      .value(d => d.value)
      .sort(null);
    const pieData = pie(this.pieChartData);
    
    svg.selectAll('path')
      .data(pieData)
      .enter()
      .append('path')
      // .attr('d', arc)
      // .attr("fill" , d => d.data.color);
  }

}

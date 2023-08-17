import { Component, ViewChild } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartEvent } from 'chart.js';


@Component({
  selector: 'app-chart',
  templateUrl: 'chart.component.html',
  styleUrls: [ 'chart.component.scss' ]
})
export class ChartComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [ [ 'To do' ], [ 'In Progress' ], 'Done' ],
    datasets: [ {
      data: [ 100, 100, 100 ]
    } ]
  };
  public chartClicked({ event, active }: { event: ChartEvent, active: { index?: number }[] }): void {
    if (active.length > 0 && active[0].index !== undefined) {
      const clickedSegmentIndex = active[0].index;
      const clickedSegmentLabel = this.pieChartData.labels[clickedSegmentIndex];
      console.log(`Clicked on segment: ${clickedSegmentLabel}`);
    }

    function newFunction(this: any) {
      return this.pieChartData.labels;
    }
  }

  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right', // Bu kısım etiketlerin konumunu belirler.
        
      },
      
      datalabels: {
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
          return value; // Add a default return statement
        },
      },
    }
  };
  
  public doughnutChartData: ChartData<'doughnut', number[], string | string[]> = {
    labels: ['Label 1', 'Label 2', 'Label 3'],
    datasets: [{
      data: [100,100, 100],
    }],
  };
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [ DatalabelsPlugin ];

  // events
  // public chartClicked({ event, active }: { event: ChartEvent, active: {}[] }): void {
  //   console.log(event, active);
  // }

  public chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

}




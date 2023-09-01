import { Component, Input, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { Project, ProjectDto } from 'src/app/interfaces/project';
import { ColumnTask } from 'src/app/interfaces/columnTasks';
import { ColumnService, ProjectService } from 'src/app/services';
import { ChartType, Column, Row } from 'angular-google-charts';
import { ColumnDto } from 'src/app/interfaces/columnDto';
import { ThemeService } from 'ng2-charts';

export interface Chart{
  name: string,
  taskLength: number
}

@Component({
  selector: 'app-chart',
  templateUrl: 'chart.component.html',
  styleUrls: [ 'chart.component.scss' ]
})
export class ChartComponent implements OnInit {

  columnData : Chart[] = [];
  chartLabels: string[] = [];
  formattedChartData: any[][] = [];
  chartData = this.formattedChartData;
  
  chartTitle: string = '';
  googleChartType =   ChartType.PieChart; 
  columnNames =  ['Value', 'Count'];
  chartOptions=  {
    legend: 'none'
  };
  taskLength: number[] = []
  columns: ColumnTask[] = []

constructor(
  private projectService: ProjectService,
  private columnService: ColumnService
){}

  ngOnInit(): void {
    const getCurrentProject: ProjectDto = this.projectService.getProjectLocal();

    this.chartTitle = getCurrentProject.name;

    this.columnService.GetProjectColumnsTasks(getCurrentProject.id).subscribe((res) => {
      debugger
      this.columns = res.data
      this.columnData = this.columns.map((column) => ({
        name: column.name,
        taskLength: column.tasks.length
      }));
     const formattedChartData: any[][] = this.columnData.map((column) => [column.name, column.taskLength]);
      console.log(formattedChartData);
      

      console.log(this.columnData);

      this.chartData = formattedChartData;

    })
    
  }
  

  loadPieChartData() {
    const getCurrentProject: ProjectDto = this.projectService.getProjectLocal();

    if (getCurrentProject) {
      this.columnService.GetProjectColumnsTasks(getCurrentProject.id).subscribe((res) => {
        const columnTask = res.data;
      })
    }
  }
 public pieChartPlugins = [DatalabelsPlugin];

}




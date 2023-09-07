import { Component, Input, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { Project, ProjectDto } from 'src/app/interfaces/project';
import { ColumnTask } from 'src/app/interfaces/columnTasks';
import { ColumnService, ProjectService, TaskService } from 'src/app/services';
import { ChartType, Column, Row } from 'angular-google-charts';
import { ColumnDto } from 'src/app/interfaces/columnDto';
import { ThemeService } from 'ng2-charts';
import { Router } from '@angular/router';

export interface Chart {
  name: string,
  taskLength: number,
  columnid: number
}

@Component({
  selector: 'app-chart',
  templateUrl: 'chart.component.html',
  styleUrls: ['chart.component.scss']
})
export class ChartComponent implements OnInit {

  columnData: Chart[] = [];
  chartLabels: string[] = [];
  formattedChartData: any[][] = [];
  chartData = this.formattedChartData;

  chartTitle: string = '';
  googleChartType = ChartType.PieChart;
  columnNames = ['Value', 'Count'];
  chartOptions = {
    legend: 'none'
  };
  taskLength: number[] = []
  columns: ColumnTask[] = []
  specColumn: string
  theColumnId: number
  constructor(
    private projectService: ProjectService,
    private columnService: ColumnService,
    private taskService: TaskService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const getCurrentProject: ProjectDto = this.projectService.getProjectLocal();

    this.chartTitle = getCurrentProject.name;

    this.columnService.GetProjectColumnsTasks(getCurrentProject.id).subscribe((res) => {

      this.columns = res.data
      this.columnData = this.columns.map((column) => ({
        name: column.name,
        taskLength: column.tasks.length,
        columnid: column.id
      }));
      const formattedChartData: any[][] = this.columnData.map((column) => [column.name, column.taskLength]);
      console.log(formattedChartData);

      console.log(this.columnData);

      this.chartData = formattedChartData;

    })

  }
  public pieChartPlugins = [DatalabelsPlugin];



  handleClickColumn(event: any) {
    console.log(event);
    let rowNumber = event.selection[0].row
    console.log(rowNumber);
    if (this.columnData[rowNumber]) {
      this.theColumnId = this.columnData[rowNumber].columnid
      this.taskService.setSelectedFilter({ id: this.theColumnId, name: 'Columns' });
      this.router.navigate(['/home/list']);
    }
  }


  // loadPieChartData() {
  //   const getCurrentProject: ProjectDto = this.projectService.getProjectLocal();

  //   if (getCurrentProject) {
  //     this.columnService.GetProjectColumnsTasks(getCurrentProject.id).subscribe((res) => {
  //       const columnTask = res.data;
  //     })
  //   }
  // }


}




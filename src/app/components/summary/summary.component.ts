import { Component, AfterViewInit, OnInit } from '@angular/core';
import { select, scaleBand, scaleLinear, axisBottom, axisLeft, scaleOrdinal, format } from 'd3';
import { Project } from 'src/app/interfaces';
import { ProjectDto } from 'src/app/interfaces/project';
import { ProjectService, TaskService } from 'src/app/services';
import { TokenService } from 'src/app/services/token.service';
import { TranslocoService} from '@ngneat/transloco';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements AfterViewInit, OnInit {
  UserName: string = '';
  Ogesayisitam: string = '';
  Ogesayisiguncelleme: string = '';
  Ogesayisiolus: string = '';
  Ogesayisitamt: string = '';

  constructor(
    public tokenService: TokenService, 
    public projectService: ProjectService,
    private taskService: TaskService ,
    public translocoService : TranslocoService) {

  }

  
  ngOnInit(): void {
    let project: ProjectDto = this.projectService.getProjectLocal();
    this.taskService.getAllProjectTask({id :project.id}).subscribe((res)=> {
      console.log(res.data); // seçili projeye ait bütün tasklar ListTask tipinde!
      
    })
  }
  // Veri seti
  private chartData = [
    { label: 'Highest', value: 5 },
    { label: 'High', value: 2 },
    { label: 'Medium', value: 3 },
    { label: 'Low', value: 1 },
    { label: 'Lowest', value: 0 }
  ];

  ngAfterViewInit() {
    this.createChart();
  }

  private createChart() {
    // SVG alanını seçin
    const svg = select('#myChart').append('svg')
      .attr('width', 500)
      .attr('height', 400);

    // Genel grafik boyutları
    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    // Eksenler için ölçekleri oluşturun
    const xScale = scaleBand()
      .domain(this.chartData.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const yScale = scaleLinear()
      .domain([0, 5]) // y ekseninin ölçeğini 0 ile 5 arasında ayarla
      .range([height - margin.bottom, margin.top]);

    // Renk ölçeğini oluşturun
    const colorScale = scaleOrdinal()
      .domain(this.chartData.map(d => d.label))
      .range(['#FF9999', '#FFFF99', '#9966FF', '#00CCFF', '#F08080']);

    // Grafik elemanlarını oluşturun
    svg.selectAll('rect')
      .data(this.chartData)
      .enter()
      .append('rect')
      .attr('x', (d: { label: string; value: number }) => xScale(d.label) || 0)
      .attr('y', (d: { label: string; value: number }) => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', (d: { label: string; value: number }) => yScale(0) - yScale(d.value))
      .attr('fill', (d: { label: string; value: number }) => colorScale(d.label) as string);

    // Eksenleri oluşturun
    const xAxis = axisBottom(xScale);
    const yAxis = axisLeft(yScale)
      .ticks(5) // y ekseninde 5 adet değer görüntülenir.
      .tickFormat(format('d')); // Her bir değer tam sayı olarak biçimlendirilir.

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis);
  }


}
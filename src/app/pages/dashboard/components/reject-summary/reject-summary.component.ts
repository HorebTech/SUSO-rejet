import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RejectResponse } from '../../../../models/response';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-reject-summary',
  templateUrl: './reject-summary.component.html',
  styleUrls: ['./reject-summary.component.scss'],
  imports: [ChartModule, TableModule, CommonModule]
})
export class RejectSummaryComponent implements OnChanges {
  @Input() data!: RejectResponse | null;

  pieData: any;
  pieOptions: any;

  variablesData: any;
  variablesOptions: any;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.preparePieChart();
      this.prepareBarChart();
      this.prepareVariablesChart();
    }
  }

  get actions() {
    return this.data?.actions ?? [];
  }

  private preparePieChart(): void {
    const labels = Object.keys(this.data!.status_breakdown);
    const values = Object.values(this.data!.status_breakdown);

    this.pieData = {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF6384', '#AA66CC']
        }
      ]
    };

    this.pieOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };
  }

  private prepareBarChart(): void {
    const labels = Object.keys(this.data!.status_breakdown);
    const values = Object.values(this.data!.status_breakdown);

    this.pieData = {
      labels: labels,
      datasets: [
        {
          label: 'Nombre d’interviews',
          backgroundColor: '#42A5F5',
          data: values
        }
      ]
    };

    this.pieOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }

  private prepareVariablesChart(): void {
    const labels = Object.keys(this.data!.variables_stats);
    const values = Object.values(this.data!.variables_stats);

    this.variablesData = {
      labels: labels,
      datasets: [
        {
          label: 'Nombre de commentaires par variable',
          backgroundColor: '#66BB6A',
          data: values
        }
      ]
    };

    this.variablesOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }

}

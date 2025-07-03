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

  // Variables pour afficher les statistiques
  total: number = 0;
  commented: number = 0;
  rejected: number = 0;
  errors: number = 0;


  pieData: any;
  
  variablesData: any;
  variablesOptions: any;
  
  
  pieDataCommented: any;
  pieDataRejected: any;
  pieOptions: any;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.prepareSummaryData();
      this.preparePieChart();
      this.prepareBarChart();
      this.prepareVariablesChart();
    }
  }

  private prepareSummaryData(): void {
    this.total = this.data?.stats.total || 0;
    this.commented = this.data?.stats.commented || 0;
    this.rejected = this.data?.stats.rejected || 0;
    this.errors = this.data?.stats.errors || 0;
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

  private preparePieCharts(): void {
    const commented = this.data?.stats.commented || 0;
    const total = this.data?.stats.total || 0;
    const notCommented = total - commented;

    // Graphique Pie pour 'commented' vs 'total'
    this.pieDataCommented = {
      labels: ['Commenté', 'Non commenté'],
      datasets: [
        {
          data: [commented, notCommented],
          backgroundColor: ['#42A5F5', '#FF6384'],
          hoverBackgroundColor: ['#64B5F6', '#FF7B8D']
        }
      ]
    };

    const rejected = this.data?.stats.rejected || 0;
    const notRejected = total - rejected;

    // Graphique Pie pour 'rejected' vs 'total'
    this.pieDataRejected = {
      labels: ['Rejeté', 'Non rejeté'],
      datasets: [
        {
          data: [rejected, notRejected],
          backgroundColor: ['#66BB6A', '#FF8A65'],
          hoverBackgroundColor: ['#81C784', '#FF9E78']
        }
      ]
    };

    // Options pour les graphiques Pie
    this.pieOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem: any) {
              const value = tooltipItem.raw;
              const total = tooltipItem.chart.data.datasets[tooltipItem.datasetIndex].data.reduce((a: any, b: any) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(2);
              return `${tooltipItem.label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    };
  }
}

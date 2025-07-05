import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Table } from 'primeng/table';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-rejet-table',
  standalone: true,
  templateUrl: './rejet-table.component.html',
  styleUrls: ['./rejet-table.component.scss'],
  imports: [TableModule, ButtonModule, InputTextModule],
})
export class RejetTableComponent implements OnChanges {
  @Input() data!: any;  // données reçues du service

  // Tableau pour les actions
  actions: any[] = [];
  filteredActions: any[] = [];

  constructor(private messageService: MessageService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.actions = this.data.actions;
      this.filteredActions = [...this.actions]; // Copie des actions pour la recherche
    }
  }

  // Fonction de recherche
  search(event: any) {
    const searchValue = event.target.value.toLowerCase();
    this.filteredActions = this.actions.filter(action =>
      action.NOM_ENQ.toLowerCase().includes(searchValue) ||
      action.variable.toLowerCase().includes(searchValue) ||
      action.interview_key.toLowerCase().includes(searchValue)
    );
  }

  // Exporter toutes les données au format Excel (XLSX)
  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.actions); // Utiliser toutes les actions
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Actions'); // Créer une feuille "Actions"
    
    // Exporter le fichier Excel
    XLSX.writeFile(wb, 'actions_export.xlsx');
  }

  // Exporter les données filtrées en CSV
  exportCSV(table: Table) {
    table.exportCSV();
  }
}

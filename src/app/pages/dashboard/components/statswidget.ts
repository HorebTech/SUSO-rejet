import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnexionService } from '../../../services/connexion.service';
import { MessageService } from 'primeng/api';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    template: `<div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card border border-slate-300 relative dark:border-slate-600 mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block p-2 rounded-lg border border-slate-600 relative dark:border-slate-200 text-xl font-medium mb-4">Questionnaires</span>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-chart-line text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <div class="h-10">
                    <span class="h-5 mb-2">Nombre de questionnaires observés dans le workspace <span class="font-bold text-blue-500 text-md">{{apiConfig.workspace}}</span></span>
                </div>
                <div class="dark:text-surface-0 h-5 mt-3 font-bold text-black text-4xl nomber-stat">{{questionnaires?.count}}</div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 relative xl:col-span-3">
            <div class="card border border-slate-300 dark:border-slate-600 mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block p-2 rounded-lg border border-slate-600 relative dark:border-slate-200 text-xl font-medium mb-4">Entretiens</span>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-pen-to-square text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <div class="h-10">
                    <span>Nombre d'entretiens cumulé reçu de tous les questionnaires</span>
                </div>
                <div class="dark:text-surface-0 h-5 nomber-stat mt-3 font-bold text-black text-4xl">{{workspage?.total_interviews}}</div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3 relative">
            <div class="card border border-slate-300 dark:border-slate-600 mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block p-2 rounded-lg border border-slate-600 relative dark:border-slate-200 text-xl font-medium mb-4">Entretiens terminés</span>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-stopwatch text-cyan-500 !text-xl"></i>
                    </div>
                </div>
                <div class="h-10">
                    <span>Entretien(s) terminé(s) et synchronisés sur <span class="text-md text-cyan-500 font-bold">{{workspage?.total_interviews}} </span>entretiens cumulé de tous les questionnaires</span>
                </div>
                <div class="dark:text-surface-0 h-5 nomber-stat mt-3 font-bold text-black text-4xl">{{workspage?.status_counts.COMPLETED}}</div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 relative xl:col-span-3">
            <div class="card border border-slate-300 dark:border-slate-600 mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color background-4 text-red-500 text-xl font-medium mb-4">Entretiens rejetés</span>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-ban text-red-500 !text-xl"></i>
                    </div>
                </div>
                <div class="h-10">
                    <span>Entretien(s) rejeté(s) sur <span class="text-md text-red-500 font-bold">{{workspage?.total_interviews}}  </span></span>
                </div>
                <div class="dark:text-surface-0 h-5 nomber-stat mt-3 font-bold text-black text-4xl">{{workspage?.status_counts.REJECTEDBYSUPERVISOR == undefined ? "0" : workspage?.status_counts.REJECTEDBYSUPERVISOR}}</div>
            </div>
        </div>`
})
export class StatsWidget implements OnInit {

    apiConfig = {
        api_url: '',
        username: '',
        password: '',
        workspace: '',
    };

    workspage! : any;
    questionnaires! : any;

    constructor(
        private connexionService: ConnexionService,
        private messageService: MessageService
    ) {}

    private loadConfigFromLocalStorage(): void {
        this.apiConfig = {
            api_url: localStorage.getItem('api_url') || '',
            username: localStorage.getItem('username') || '',
            password: localStorage.getItem('password') || '',
            workspace: localStorage.getItem('selectedWorkspace') || '',
        };
    }

    ngOnInit(): void {
        this.loadConfigFromLocalStorage();
        this.connexionService.getStats(this.apiConfig).subscribe({
            next: (response) => {
                this.workspage = response;
                console.log(response);
                
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message, life: 10000 });
            }
        });
        this.connexionService.getQuestionnaires(this.apiConfig).subscribe({
            next: (response) => {
                this.questionnaires = response;
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message, life: 10000 });
            }
        })
    }
    
}

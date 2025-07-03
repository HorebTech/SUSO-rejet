import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnexionService } from '../../../services/connexion.service';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { IftaLabelModule } from 'primeng/iftalabel';

interface Questionnaire {
    questionnaire_id: string;
    title: string;
    variable: string;
    versions: number[];
}

interface Statut {
    title: string;
    value: string;
}

@Component({
    standalone: true,
    selector: 'app-dowload',
    imports: [CommonModule, CardModule, ButtonModule, FormsModule, SelectModule, IftaLabelModule],
    template: `
    <div class="col-span-12">
        <div class="col-span-6 xl:col-span-6">
            <p-card header="Exportation de données">
                <div class="bloc_export">
                <div class="bloc_export1">
                        <span class="text-xl">Questionnaire</span>
                        <p-iftalabel class="w-full">
                        <p-select appendTo="body" 
                                [(ngModel)]="selectedQuestionnaire" 
                                (onChange)="onQuestionnaireChange()"
                                inputId="dd-questionnaire" 
                                [options]="questionnaires" 
                                optionLabel="title" 
                                optionValue="questionnaire_id" 
                                styleClass="w-full">
                        </p-select>
                        <label for="dd-questionnaire">Questionnaire</label>
                    </p-iftalabel>
                    <small>Sélectionnez le questionnaire que vous voulez télécharger</small>
                    <br/>
                    <br/>
                    <span class="text-xl">Version du questionnaire</span>
                    <p-iftalabel class="w-full">
                        <p-select appendTo="body" 
                                [(ngModel)]="selectedVersion" 
                                inputId="dd-version" 
                                [options]="versions" 
                                styleClass="w-full">
                            <ng-template let-version pTemplate="item">
                                {{version}}
                            </ng-template>
                        </p-select>
                        <label for="dd-version">Version</label>
                    </p-iftalabel>
                    <small>Sélectionnez la version du questionnaire que vous voulez télécharger</small>
                    <br/>
                    <br/>
                    <span class="text-xl">Statut des entretiens</span>
                    <p-iftalabel class="w-full">
                        <p-select appendTo="body" 
                                [(ngModel)]="selectedStatut" 
                                inputId="dd-statut" 
                                [options]="statuts"
                                optionLabel="title" 
                                optionValue="value" 
                                styleClass="w-full">
                            
                        </p-select>
                        <label for="dd-version">Statut des entretiens</label>
                    </p-iftalabel>
                    <small>Sélectionnez le statut des entretiens</small>
                </div>
                <div class="bloc_export2">
                    <div class="download_button">
                        <div class="button_one">
                            <span class="titre_button">STATA</span>
                            <p-button (onClick)="export('STATA')" class="stata p-0" aria-label="Stata">
                                <img src="/assets/images/stata.png" class="mx-auto" style="width: 40px; height: auto;" alt="logo STATA" />
                                <span class="px-4 font-semibold">Télécharger</span>
                            </p-button>
                        </div>
                        <div class="button_one">
                            <span class="titre_button">SPSS</span>
                            <p-button (onClick)="export('SPSS')" class="spss p-0" aria-label="Spss">
                                <img src="/assets/images/spss.png" class="mx-auto" style="width: 40px; height: auto;" alt="logo SPSS" />
                                <span class="px-4 font-semibold">Télécharger</span>
                            </p-button>
                        </div>
                        <div class="button_one">
                            <span class="titre_button">Binary</span>
                            <p-button (onClick)="export('Binary')" class="binary p-0" aria-label="Binary">
                                <img src="/assets/images/ddi.png" class="mx-auto" style="width: 40px; height: auto;" alt="logo Binary" />
                                <span class="px-4 font-semibold">Télécharger</span>
                            </p-button>
                        </div>
                        <div class="button_one">
                            <span class="titre_button">Tabular</span>
                            <p-button (onClick)="export('Tabular')" class="tabular p-0" aria-label="Tabular">
                                <img src="/assets/images/tabular.png" class="mx-auto" style="width: 40px; height: auto;" alt="logo Tabular" />
                                <span class="px-4 font-semibold">Télécharger</span>
                            </p-button>
                        </div>
                        <div class="button_one">
                            <span class="titre_button">Paradata</span>
                            <p-button (onClick)="export('Paradata')" class="paradata p-0" aria-label="Paradata">
                                <img src="/assets/images/tabular.png" class="mx-auto" style="width: 40px; height: auto;" alt="logo Paradata" />
                                <span class="px-4 font-semibold">Télécharger</span>
                            </p-button>
                        </div>
                        <div class="button_one">
                            <span class="titre_button">DDI</span>
                            <p-button (onClick)="export('DDI')" class="ddi p-0" aria-label="DDI">
                                <img src="/assets/images/ddi.png" class="mx-auto" style="width: 40px; height: auto;" alt="logo DDI" />
                                <span class="px-4 font-semibold">Télécharger</span>
                            </p-button>
                        </div>
                    </div>
                    <!-- <div class="text-description">
                        <p>
                            Stata (.dta) : Idéal pour les utilisateurs de Stata, un logiciel statistique largement utilisé en économétrie et en sciences sociales. L'exportation inclut les étiquettes de variables et de valeurs, facilitant l'importation directe.
                            SPSS (.sav) : Pour les utilisateurs de SPSS, ce format inclut également les étiquettes de variables et de valeurs, garantissant une intégration transparente avec le logiciel.
                            R : Bien que Survey Solutions n'exporte pas directement en .Rdata, le format CSV couplé au fichier de syntaxe R (voir DDI) permet une importation facile dans R.
                        </p>
                        <p>
                            DDI (Data Documentation Initiative) Codebook (.xml) : C'est un point fort majeur de Survey Solutions. Le format DDI est un standard international pour la documentation des données de recherche.
                            Paradata / Journal d'Audit : Exportation des données de processus (paradata) telles que les durées de réponse, les clics, les modifications, les pauses. Essentiel pour l'évaluation de la qualité des données et l'optimisation des questionnaires.
                        </p>
                    </div> -->
                </div>
                </div>

            </p-card>
        </div>
    </div>
    `
})

export class Download implements OnInit {

    questionnaires: Questionnaire[] = [];
    selectedQuestionnaire: string | null = null;

    versions: number[] = [];
    selectedVersion: number | null = null;

    statuts: Statut[] = [
        { title: 'All', value: 'All' },
        { title: 'SupervisorAssigned', value: 'SupervisorAssigned' },
        { title: 'InterviewerAssigned', value: 'InterviewerAssigned' },
        { title: 'Completed', value: 'Completed' },
        { title: 'RejectedBySupervisor', value: 'RejectedBySupervisor' },
        { title: 'ApprovedBySupervisor', value: 'ApprovedBySupervisor' },
        { title: 'RejectedByHeadquarters', value: 'RejectedByHeadquarters' },
        { title: 'ApprovedByHeadquarters', value: 'ApprovedByHeadquarters' }
    ];
    selectedStatut: string | null = null;

    apiConfig = {
        api_url: '',
        username: '',
        password: '',
        workspace: '',
    };

    constructor(
        private connexionService: ConnexionService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.loadConfigFromLocalStorage();
        this.loadQuestionnaires();
    }

    private loadConfigFromLocalStorage(): void {
        this.apiConfig = {
            api_url: localStorage.getItem('api_url') || '',
            username: localStorage.getItem('username') || '',
            password: localStorage.getItem('password') || '',
            workspace: localStorage.getItem('selectedWorkspace') || '',
        };
    }

    private loadQuestionnaires(): void {
        this.connexionService.getQuestionnaires(this.apiConfig).subscribe({
            next: (response) => {
                this.questionnaires = response.data;
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: err.error.message,
                    life: 10000
                });
            }
        });
    }

    onQuestionnaireChange(): void {
        const selected = this.questionnaires.find(q => q.questionnaire_id === this.selectedQuestionnaire);
        this.versions = selected ? selected.versions : [];
        this.selectedVersion = this.versions.length > 0 ? this.versions[0] : null;
    }

    private getSelectedVariable(): string {
        const selected = this.questionnaires.find(q => q.questionnaire_id === this.selectedQuestionnaire);
        return selected?.variable || '';
    }

    private buildExportData(format: string): any {
        return {
            api_url: this.apiConfig.api_url,
            username: this.apiConfig.username,
            password: this.apiConfig.password,
            workspace: this.apiConfig.workspace,
            variable_qx: this.getSelectedVariable(),
            version: this.selectedVersion!,
            export_type: format,
            interview_status: this.selectedStatut!
        };
    }

    private downloadFile(blob: Blob, filename: string): void {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    export(format: string): void {
        const variable = this.getSelectedVariable();
        const version = this.selectedVersion;
        const interviewStatus = this.selectedStatut;

        const fileName = `${variable}_${version}_${format}_${interviewStatus}.zip`;

        const exportData = this.buildExportData(format);

        this.connexionService.downloadQuestionnaire(exportData)
            .subscribe({
                next: (blob) => this.downloadFile(blob, fileName),
                error: (err) => console.error("Erreur pendant le téléchargement :", err)
            });
    }
}
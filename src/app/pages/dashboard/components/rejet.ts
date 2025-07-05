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
import { FileUploadComponent } from '../../../file-upload/file-upload.component';
import { RejectResponse } from '../../../models/response';
import { RejectSummaryComponent } from "./reject-summary/reject-summary.component";
import { RejetTableComponent } from './rejet-table/rejet-table.component';

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
    selector: 'app-rejet',
    imports: [CommonModule, CardModule, ButtonModule, FormsModule, SelectModule, IftaLabelModule, FileUploadComponent, RejectSummaryComponent, RejetTableComponent],
    template: `
    <div class="col-span-12">
        <div class="col-span-6 xl:col-span-6">
            <div header="Rejetez automatiquement les questionnaires" class="card border card-box rounded-xl border-slate-300 dark:border-slate-600">
                <div>
                    <p class="text-3xl font-bold text-black dark:text-surface-0">Rejet d'entretiens</p>
                    <p>Sélectionnez le fichier de rapport concernant le questionnaire à vérifier et exportez le grâce à ce buton. Les interviews repertoriés dans ce fichier, seront rejetés automatiquement. Les enquêteurs devront synchroniser les tablettes pour appercevoir les entretiens rejetés.</p>
                </div>   
                <div class="rejet_resultat">
                    <form (ngSubmit)="submit()" enctype="multipart/form-data">
                    <app-file-upload (fileUploaded)="handleFileUpload($event)"></app-file-upload>
                    <p-button type="submit" variant="outlined" severity="contrast" label="Soumettre" />
                    </form>
                    <div class="partie-resultat">
                        <app-reject-summary [data]="result"></app-reject-summary>
                    </div>
                </div>
                <div>
                    <app-rejet-table [data]="result"></app-rejet-table>
                </div>
            </div>
        </div>
    </div>
    `
})

export class Rejet implements OnInit {

    selectedFile: File | null = null;
    result: any = null;

    uploadedFiles: any[] = [];

    questionnaires: Questionnaire[] = [];
    selectedQuestionnaire: string | null = null;

    versions: number[] = [];
    selectedVersion: number | null = null;

    handleFileUpload(files: any[]): void {
        if (files && files.length) {
            this.selectedFile = files[0].file;
        } else {
            this.selectedFile = null;
        }
    }

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

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file && file.name.endsWith('.xlsx')) {
            this.selectedFile = file;
        } else {
            alert("Fichier invalide. Seuls les fichiers .xlsx sont acceptés.");
        }
    }

    submit(): void{
        if (!this.selectedFile) {
            this.messageService.add({ severity: 'warn', summary: 'Attention', detail: 'Veuillez sélectionner un fichier Excel.', life: 6000 });
            return;
        } 

        const formData = new FormData();
        formData.append('excel_file', this.selectedFile);
        formData.append('api_url', this.apiConfig.api_url);
        formData.append('username', this.apiConfig.username);
        formData.append('password', this.apiConfig.password);
        formData.append('workspace', this.apiConfig.workspace);

        this.connexionService.uploadExcel(formData).subscribe({
            next: (res: RejectResponse) => {
                this.result = res;
                console.log(res);
                
                this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: res.message,
                life: 8000
                });
            },
            error: (err) => {
                this.result = { error: err.error || err.message } as any;
                this.messageService.add({
                severity: 'error',
                summary: 'Erreur API',
                detail: err.error?.error || err.message,
                life: 8000
                });
            }
        });
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

}
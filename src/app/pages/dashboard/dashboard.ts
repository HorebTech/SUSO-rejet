import { Component, OnInit } from '@angular/core';
import { StatsWidget } from './components/statswidget';
import { Dialog } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { Download } from "./components/download";
import { Rejet } from "./components/rejet";

interface Workspace {
    name: string;
    display_name: string;
    description: string;
}

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, ButtonModule, Dialog, FormsModule, SelectModule, IftaLabelModule, Download, Rejet],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <app-stats-widget class="contents" />
            <app-dowload class="contents" />
            <app-rejet class="contents" />
            <div class="col-span-12 xl:col-span-6">
            </div>
            <div class="col-span-12 xl:col-span-6">
            </div>
        </div>
        <p-dialog header="Workspace" [modal]="true" [(visible)]="visible" [style]="{ width: '40rem' }" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }" [maximizable]="true">
            <p>Veuillez sélectionner le workspace avec lequel vous souhaitez travaillez, vous aurez toutes les statistiques et pourrez apporter des commentaires aux interviews des questionnaires.</p>
            <div class="card flex justify-center flex-col">
                <label class="font-bold mb-2">Sélectionnez votre workspace</label>
                <p-iftalabel class="w-full">
                    <p-select appendTo="body" [(ngModel)]="selectedWorkspace" inputId="dd-city" [options]="workspaces" optionLabel="display_name" optionValue="name" styleClass="w-full" />
                    <label for="dd-city">Workspaces</label>
                </p-iftalabel>
                <div class="mt-4">
                    <p-button  label="Submit" (onClick)="onSubmit()"  />
                </div>
            </div>
        </p-dialog>
    `
})
export class Dashboard implements OnInit {

    constructor() {}
    workspaceData!: any;
    workspaceActif!: any;
    workspaces: Workspace[] | undefined;
    selectedWorkspace: Workspace | undefined;
    visible: boolean = false;

    ngOnInit(): void {
        this.workspaceData = JSON.parse(localStorage.getItem('workspaceResponse') as any);
        this.workspaceActif = localStorage.getItem('selectedWorkspace');
        this.workspaces = this.workspaceData.data;
        if(this.workspaceActif == undefined) {
            this.visible = true;
        }
    }

    onSubmit() {
        if (this.selectedWorkspace) {
            localStorage.setItem('selectedWorkspace', this.selectedWorkspace as any);
        }
        if(this.selectedWorkspace != undefined) {
            this.visible = false;
            window.location.reload();
        }
    }
    
}

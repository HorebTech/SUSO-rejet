import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { NgOptimizedImage } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { Toast } from 'primeng/toast';
import { ConnexionService } from '../../services/connexion.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [Toast, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, FormsModule, ReactiveFormsModule],
    template: `
        <app-floating-configurator />
        <p-toast />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, orange 10%, rgba(33, 150, 243, 0) 30%)">
                    <form class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px" [formGroup]="connexionForm" (ngSubmit)="onConnected()">
                        <div class="text-center mb-8">

                            <img src="/assets/images/logo.png" class="mx-auto" style="width: 80px; height: auto;" alt="logo SInDev" />
                            
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-bold mt-2 mb-4">SInDev contrôleur d'interview</div>
                            <span class="text-muted-color font-medium">Connectez-vous pour continuer</span>
                        </div>

                        <div>
                            <label for="api_url" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">URL de votre serveur</label>
                            <input pInputText id="api_url" type="url" placeholder="https://api_url.com" class="w-full md:w-[30rem] mb-8" formControlName="api_url" [autocomplete]="" autocomplete="new-url" />

                            <label for="username" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Nom d'utilisateur</label>
                            <input pInputText id="username" type="text" placeholder="Nom d'utilisateur" class="w-full md:w-[30rem] mb-8" formControlName="username" [autocomplete]="" autocomplete="new-username" />

                            <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Mot de passe</label>
                            <p-password id="password" formControlName="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false" autocomplete="new-password"></p-password>

                            <p-button label="Connexion" styleClass="w-full mt-4" type="submit"></p-button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
})
export class Login implements OnInit {
    destroy$: Subject<boolean> = new Subject<boolean>();
    connexionForm: FormGroup;

    ngOnInit() {

    }

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private connexionService: ConnexionService,
        private messageService: MessageService) {
        this.connexionForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            api_url: ['', Validators.required]
        });
    }

    onConnected() {
        if(this.connexionForm.valid) {
            this.connexionService.getWorkspaces(this.connexionForm.value).subscribe({
                next: (response) => {
                    this.router.navigate(['/']);
                    this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Connexion réussit', life: 10000 });
                        localStorage.setItem('username', this.connexionForm.value.username);
                        localStorage.setItem('password', this.connexionForm.value.password); // ⚠️ attention : peu sécurisé
                        localStorage.setItem('api_url', this.connexionForm.value.api_url); // ⚠️ attention : peu sécurisé
                        localStorage.setItem('workspaceResponse', JSON.stringify(response));
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message, life: 10000 });
                }
            })
        } else if(!this.connexionForm.value.api_url) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Veuillez saisir l'url de votre serveur!", life: 10000 });
        } else if(!this.connexionForm.value.password) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Le mot de passe est requis!", life: 10000 });
        } else if(!this.connexionForm.value.username) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Le nom d'utilisateur est requis!", life: 10000 });
        }
        
    }


}

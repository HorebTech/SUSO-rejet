import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './app/shared/loader/loader.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, LoaderComponent],
    template: `
    <app-loader></app-loader>
    <router-outlet></router-outlet>`
})
export class AppComponent {}

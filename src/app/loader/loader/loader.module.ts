import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderComponent } from './loader.component';

@NgModule({
    imports: [
        MatProgressSpinnerModule,
        CommonModule
    ],
    exports: [LoaderComponent],
    declarations: [LoaderComponent]
})
export class LoaderModule { }
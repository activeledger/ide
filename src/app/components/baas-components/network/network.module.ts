import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NetworkRoutingModule } from './network-routing.module';
import { ManagementComponent } from './management/management.component';
import { BuilderComponent } from './builder/builder.component';


@NgModule({
  declarations: [ManagementComponent, BuilderComponent],
  imports: [
    CommonModule,
    NetworkRoutingModule
  ]
})
export class NetworkModule { }

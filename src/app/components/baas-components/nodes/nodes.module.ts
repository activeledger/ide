import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NodesRoutingModule } from './nodes-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManagementComponent } from './management/management.component';


@NgModule({
  declarations: [DashboardComponent, ManagementComponent],
  imports: [
    CommonModule,
    NodesRoutingModule
  ]
})
export class NodesModule { }

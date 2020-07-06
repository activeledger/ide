import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NodesRoutingModule } from "./nodes-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ManagementComponent } from "./management/management.component";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { NgxEchartsModule } from "ngx-echarts";
import * as echarts from "echarts";

@NgModule({
  declarations: [DashboardComponent, ManagementComponent],
  imports: [
    CommonModule,
    NodesRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    NgxEchartsModule.forRoot({
      echarts,
    }),
  ],
})
export class NodesModule {}

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
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MatPaginatorModule } from "@angular/material/paginator";
import { LogsComponent } from "./logs/logs.component";
import { MatSelectModule } from "@angular/material/select";
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  declarations: [DashboardComponent, ManagementComponent, LogsComponent],
  imports: [
    CommonModule,
    NodesRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    NgxEchartsModule.forRoot({
      echarts,
    }),
    FontAwesomeModule,
    MatPaginatorModule,
    SharedModule,
  ],
})
export class NodesModule {}

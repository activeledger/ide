import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ManagementComponent } from "./management/management.component";
import { LogsComponent } from "./logs/logs.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
  },
  {
    path: "dashboard",
    component: DashboardComponent,
  },
  {
    path: "nodes/:id",
    component: ManagementComponent,
  },
  {
    path: "nodes",
    component: ManagementComponent,
  },
  {
    path: "logs/:id",
    component: LogsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NodesRoutingModule {}

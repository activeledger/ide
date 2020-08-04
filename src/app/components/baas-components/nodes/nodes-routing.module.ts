import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ManagementComponent } from "./management/management.component";

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
    path: "nodes",
    component: ManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NodesRoutingModule {}

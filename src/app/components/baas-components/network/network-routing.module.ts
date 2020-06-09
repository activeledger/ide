import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ManagementComponent } from "./management/management.component";

const routes: Routes = [
  {
    path: "",
    component: ManagementComponent,
  },
  {
    path: "management",
    component: ManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetworkRoutingModule {}

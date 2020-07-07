import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NetworkRoutingModule } from "./network-routing.module";
import { ManagementComponent } from "./management/management.component";
import { BuilderComponent } from "./builder/builder.component";
import { MatPaginatorModule } from "@angular/material/paginator";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MatTableModule } from "@angular/material/table";

@NgModule({
  declarations: [ManagementComponent, BuilderComponent],
  imports: [
    CommonModule,
    NetworkRoutingModule,
    FontAwesomeModule,
    MatPaginatorModule,
    MatTableModule,
  ],
})
export class NetworkModule {}

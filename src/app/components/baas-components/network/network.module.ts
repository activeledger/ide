import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NetworkRoutingModule } from "./network-routing.module";
import { ManagementComponent } from "./management/management.component";
import { BuilderComponent } from "./builder/builder.component";
import { MatPaginatorModule } from "@angular/material/paginator";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTabsModule } from "@angular/material/tabs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [ManagementComponent, BuilderComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NetworkRoutingModule,
    FontAwesomeModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatTabsModule,
  ],
})
export class NetworkModule {}

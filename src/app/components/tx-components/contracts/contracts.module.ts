/*
 * MIT License (MIT)
 * Copyright (c) 2018 Activeledger
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EditContractsComponent } from "./edit-contracts/edit-contracts.component";
import { InfoContractsComponent } from "./info-contracts/info-contracts.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ClickOutsideModule } from "ng-click-outside";
import { MatTableModule } from "@angular/material/table";
import { ContractsComponent } from "./contracts/contracts.component";
import { ContractsRoutingModule } from "./contracts-routing.module";
import { WorkflowModule } from "../../../shared/components/workflow/workflow.module";
import { MonacoEditorComponent } from "../../../shared/components/monaco-editor/monaco-editor.component";

import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { FormsModule } from "@angular/forms";

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
    ContractsComponent,
    EditContractsComponent,
    InfoContractsComponent,
    MonacoEditorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    ContractsRoutingModule,
    WorkflowModule,
    FontAwesomeModule,
    ClickOutsideModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
  ],
})
export class ContractsModule {}

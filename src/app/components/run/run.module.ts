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

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RunRoutingModule } from "./run-routing.module";
import { RunComponent } from "./run/run.component";
import { NgJsonEditorModule } from "ang-jsoneditor";
import {
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatSlideToggleModule
} from "@angular/material";
import { FormsModule } from "@angular/forms";
import { SidemenuModule } from "../../shared/sidemenu/sidemenu.module";
import { MonacoEditorModule } from "ngx-monaco-editor";
import { AceEditorModule } from "ng2-ace-editor";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
@NgModule({
  declarations: [RunComponent],
  imports: [
    CommonModule,
    RunRoutingModule,
    NgJsonEditorModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    SidemenuModule,
    MonacoEditorModule,
    AceEditorModule,
    FontAwesomeModule,
    MatSlideToggleModule
  ]
})
export class RunModule {}
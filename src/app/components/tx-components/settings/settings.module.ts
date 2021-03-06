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
import { AboutComponent } from "./sub-settings/about/about.component";
import { AccountComponent } from "./sub-settings/account/account.component";
import { GeneralComponent } from "./sub-settings/general/general.component";
import { BackupComponent } from "./sub-settings/backup/backup.component";
import { RestoreComponent } from "./sub-settings/restore/restore.component";
import { ConnectionsComponent } from "./sub-settings/connections/connections.component";
import { DeveloperComponent } from "./sub-settings/developer/developer.component";
import { UpdateComponent } from "./sub-settings/update/update.component";
import { WorkspaceComponent } from "./sub-settings/workspace/workspace.component";
import { SettingsComponent } from "./settings/settings.component";
import { ColorPickerModule } from "ngx-color-picker";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule } from "@angular/material/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { NgxSpinnerModule } from "ngx-spinner";
import { MatButtonModule } from "@angular/material/button";
import { SettingsRoutingModule } from "./settings-routing.module";

@NgModule({
  declarations: [
    AboutComponent,
    AccountComponent,
    GeneralComponent,
    BackupComponent,
    RestoreComponent,
    ConnectionsComponent,
    DeveloperComponent,
    UpdateComponent,
    WorkspaceComponent,
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    ColorPickerModule,
    FormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatOptionModule,
    MatSelectModule,
    NgxSpinnerModule,
    MatButtonModule,
    MatInputModule,
    SettingsRoutingModule,
  ],
})
export class SettingsModule {}

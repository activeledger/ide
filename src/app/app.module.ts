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

import "zone.js/dist/zone-mix";
import "reflect-metadata";
import "../polyfills";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { HttpClientModule, HttpClient } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

// NG Translate
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

// Angular material
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { PrettyJsonModule } from "angular2-prettyjson";
import { NgxSpinnerModule } from "ngx-spinner";

import { ElectronService } from "./shared/services/electron.service";
import { ConfigService } from "./shared/services/config.service";
import { GeneralService } from "./shared/services/general.service";
import { KeyService } from "./shared/services/key.service";
import { LedgerService } from "./shared/services/ledger.service";
import { NamespaceService } from "./shared/services/namespace.service";
import { DatabaseService } from "./providers/database.service";
import { NgJsonEditorModule } from "ang-jsoneditor";
import { DataService } from "./shared/services/data.service";
import { ConsoleService } from "./shared/services/console.service";
import { SettingsService } from "./shared/services/settings.service";

import { ErrorDialogComponent } from "./shared/dialogs/error-dialog/error-dialog.component";
import { WarningDialogComponent } from "./shared/dialogs/warning-dialog/warning-dialog.component";
import { InfoDialogComponent } from "./shared/dialogs/info-dialog/info-dialog.component";
import { ConfirmDialogComponent } from "./shared/dialogs/confirm-dialog/confirm-dialog.component";
import { AdvancedConfirmDialogComponent } from "./shared/dialogs/advanced-confirm-dialog/advanced-confirm-dialog.component";
import { ConsoleComponent } from "./shared/components/console/console.component";
import { InputDialogComponent } from "./shared/dialogs/input-dialog/input-dialog.component";
import { QuickBarComponent } from "./shared/components/quick-bar/quick-bar.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SaveContractDialogComponent } from "./shared/dialogs/save-contract-dialog/save-contract-dialog.component";
import { NtobPipe } from "./shared/pipes/ntob.pipe";
import { ClipboardModule } from "ngx-clipboard";
import { ContractInfoDialogComponent } from "./shared/dialogs/contract-info-dialog/contract-info-dialog.component";
import { ClickOutsideModule } from "ng-click-outside";
import { LoginDialogComponent } from "./shared/dialogs/login-dialog/login-dialog.component";
import { BlockedDialogComponent } from "./shared/dialogs/blocked-dialog/blocked-dialog.component";
import { ContractsModule } from "./components/contracts/contracts.module";
import { SettingsModule } from "./components/settings/settings.module";
import { HomeModule } from "./components/home/home.module";
import { IdentityModule } from "./components/identity/identity.module";
import { KeysModule } from "./components/keys/keys.module";
import { NamespaceModule } from "./components/namespace/namespace.module";
import { SwaggerModule } from "./components/swagger/swagger.module";
import { SigningModule } from "./components/signing/signing.module";
import { MonacoEditorModule } from "@materia-ui/ngx-monaco-editor";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    ErrorDialogComponent,
    WarningDialogComponent,
    InfoDialogComponent,
    ConfirmDialogComponent,
    AdvancedConfirmDialogComponent,
    ConsoleComponent,
    InputDialogComponent,
    QuickBarComponent,
    SaveContractDialogComponent,
    NtobPipe,
    ContractInfoDialogComponent,
    LoginDialogComponent,
    BlockedDialogComponent,
  ],
  imports: [
    NgxSpinnerModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    // BrowserAnimationsModule,
    NoopAnimationsModule,
    PrettyJsonModule,
    MatTabsModule,
    // AngularSplitModule,
    MatExpansionModule,
    FontAwesomeModule,
    MatListModule,
    MatTableModule,
    MatDialogModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatInputModule,
    MatCardModule,
    MatButtonToggleModule,
    ClipboardModule,
    ClickOutsideModule,
    MatBadgeModule,
    MatIconModule,
    MatSnackBarModule,
    MonacoEditorModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgJsonEditorModule,
    // Internal modules
    HomeModule,
    IdentityModule,
    KeysModule,
    NamespaceModule,
    SigningModule,
    SwaggerModule,
    ContractsModule,
    SettingsModule,
  ],
  providers: [
    ElectronService,
    ConfigService,
    GeneralService,
    KeyService,
    LedgerService,
    NamespaceService,
    DatabaseService,
    DataService,
    ConsoleService,
    SettingsService,
    QuickBarComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

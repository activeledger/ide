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
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadChildren: "./components/home/home.module#HomeModule"
  },
  {
    path: "keys",
    loadChildren: "./components/keys/keys.module#KeysModule",
    runGuardsAndResolvers: "paramsChange"
  },
  {
    path: "identity",
    loadChildren: "./components/identity/identity.module#IdentityModule",
    runGuardsAndResolvers: "paramsChange"
  },
  {
    path: "contracts",
    loadChildren: "./components/contracts/contracts.module#ContractsModule",
    runGuardsAndResolvers: "paramsChange"
  },
  {
    path: "settings",
    loadChildren: "./components/settings/settings.module#SettingsModule",
    runGuardsAndResolvers: "paramsChange"
  },
  {
    path: "namespaces",
    loadChildren: "./components/namespace/namespace.module#NamespaceModule"
  },
  {
    path: "signing",
    loadChildren: "./components/signing/signing.module#SigningModule"
  },
  {
    path: "run",
    loadChildren: "./components/run/run.module#RunModule"
  },
  {
    path: "swagger",
    loadChildren: "./components/swagger/swagger.module#SwaggerModule"
  },
  {
    path: "signing",
    loadChildren: "./components/signing/signing.module#SigningModule"
  },
  {
    path: "workflow",
    loadChildren: "./shared/components/workflow/workflow.module#WorkflowModule"
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: "reload"
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

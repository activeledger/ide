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
    loadChildren: () =>
      import("./components/tx-components/home/home.module").then(
        (m) => m.HomeModule
      ),
  },
  {
    path: "keys",
    loadChildren: () =>
      import("./components/tx-components/keys/keys.module").then(
        (m) => m.KeysModule
      ),
    runGuardsAndResolvers: "paramsChange",
  },
  {
    path: "identity",
    loadChildren: () =>
      import("./components/tx-components/identity/identity.module").then(
        (m) => m.IdentityModule
      ),
    runGuardsAndResolvers: "paramsChange",
  },
  {
    path: "contracts",
    loadChildren: () =>
      import("./components/tx-components/contracts/contracts.module").then(
        (m) => m.ContractsModule
      ),
    runGuardsAndResolvers: "paramsChange",
  },
  {
    path: "settings",
    loadChildren: () =>
      import("./components/tx-components/settings/settings.module").then(
        (m) => m.SettingsModule
      ),
    runGuardsAndResolvers: "paramsChange",
  },
  {
    path: "namespaces",
    loadChildren: () =>
      import("./components/tx-components/namespace/namespace.module").then(
        (m) => m.NamespaceModule
      ),
  },
  {
    path: "signing",
    loadChildren: () =>
      import("./components/tx-components/signing/signing.module").then(
        (m) => m.SigningModule
      ),
  },
  {
    path: "run",
    loadChildren: () =>
      import("./components/tx-components/run/run.module").then(
        (m) => m.RunModule
      ),
  },
  {
    path: "swagger",
    loadChildren: () =>
      import("./components/tx-components/swagger/swagger.module").then(
        (m) => m.SwaggerModule
      ),
  },
  {
    path: "signing",
    loadChildren: () =>
      import("./components/tx-components/signing/signing.module").then(
        (m) => m.SigningModule
      ),
  },
  {
    path: "workflow",
    loadChildren: () =>
      import("./shared/components/workflow/workflow.module").then(
        (m) => m.WorkflowModule
      ),
  },
  {
    path: "network",
    loadChildren: () =>
      import("./components/baas-components/network/network.module").then(
        (m) => m.NetworkModule
      ),
  },
  {
    path: "nodes",
    loadChildren: () =>
      import("./components/baas-components/nodes/nodes.module").then(
        (m) => m.NodesModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: "reload",
      paramsInheritanceStrategy: "always",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormArray } from "@angular/forms";
import {
  faFileExport,
  faBath,
  faSave,
  faLayerPlus,
} from "@fortawesome/pro-light-svg-icons";

@Component({
  selector: "builder",
  templateUrl: "./builder.component.html",
  styleUrls: ["./builder.component.scss"],
})
export class BuilderComponent implements OnInit {
  public icons = {
    save: faSave,
    clear: faBath,
    export: faFileExport,
    addNode: faLayerPlus,
  };

  public configForm = new FormGroup({
    name: new FormControl(""),
    activeledger: new FormGroup({
      consensus: new FormControl(60),
      autostart: new FormGroup({
        core: new FormControl(false),
        restore: new FormControl(false),
      }),
    }),
    security: new FormGroup({
      signedConsensus: new FormControl(false),
      encryptedConsensus: new FormControl(false),
      hardenedKeys: new FormControl(false),
    }),
    networking: new FormGroup({
      bindingAddress: new FormControl("127.0.0.1:5260"),
      selfHosted: new FormControl(true),
      selfHostIP: new FormControl({ value: "127.0.0.1", disabled: true }),
      selfHostPort: new FormControl("5259"),
      corePort: new FormControl("5261"),
    }),
    database: new FormGroup({
      ledger: new FormControl("activeledger"),
      event: new FormControl("activeledgerevents"),
      error: new FormControl("activeledgererrors"),
    }),
    debug: new FormControl(false),
  });

  public nodeGroup = new FormGroup({
    host: new FormControl(""),
    port: new FormControl(""),
    publicKey: new FormControl(""),
  });

  public nodeForm = new FormGroup({
    nodes: new FormArray([this.nodeGroup]),
  });

  constructor() {}

  ngOnInit(): void {}

  get nodes() {
    return this.nodeForm.get("nodes") as FormArray;
  }

  addNode(): void {
    this.nodes.push(this.nodeGroup);
  }
}

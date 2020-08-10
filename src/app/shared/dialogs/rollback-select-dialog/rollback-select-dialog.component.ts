import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { IVersionHistory } from "../../interfaces/ssh.interface";
import { version } from "process";

@Component({
  selector: "rollback-select-dialog",
  templateUrl: "./rollback-select-dialog.component.html",
  styleUrls: ["./rollback-select-dialog.component.scss"],
})
export class RollbackSelectDialogComponent implements OnInit {
  public selectedVersion: string;
  public versionData: IVersionHistory[];

  constructor(
    public dialogRef: MatDialogRef<RollbackSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public versions: { versions: IVersionHistory[] }
  ) {
    this.versionData = versions.versions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  ngOnInit(): void {}

  selectVersion(version: string) {
    this.selectedVersion = version;
  }

  ok(): void {
    this.dialogRef.close(this.selectedVersion);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}

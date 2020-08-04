import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ISSH, ISSHEdit } from "../../interfaces/ssh.interface";
import { threadId } from "worker_threads";

@Component({
  selector: "ssh-edit-connection-dialog",
  templateUrl: "./ssh-edit-connection-dialog.component.html",
  styleUrls: ["./ssh-edit-connection-dialog.component.scss"],
})
export class SshEditConnectionDialogComponent implements OnInit {
  public privateKey: string;
  public updateKey = false;

  constructor(
    public dialogRef: MatDialogRef<SshEditConnectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ISSHEdit
  ) {}

  ngOnInit(): void {}

  public save() {
    if (this.updateKey && this.privateKey) {
      this.data.newKey = this.privateKey;
    }

    this.dialogRef.close(this.data);
  }

  public cancel() {
    this.dialogRef.close();
  }
}

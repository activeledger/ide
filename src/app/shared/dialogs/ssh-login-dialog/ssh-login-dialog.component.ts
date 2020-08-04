import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ISSHLogin } from "../../interfaces/ssh.interface";

@Component({
  selector: "ssh-login-dialog",
  templateUrl: "./ssh-login-dialog.component.html",
  styleUrls: ["./ssh-login-dialog.component.scss"],
})
export class SshLoginDialogComponent implements OnInit {
  public loginDetails: ISSHLogin = {
    username: undefined,
    password: undefined,
    cancelled: false,
  };

  constructor(public dialogRef: MatDialogRef<SshLoginDialogComponent>) {}

  ngOnInit(): void {}

  public respond(): void {
    this.dialogRef.close(this.loginDetails);
  }

  public cancel(): void {
    this.loginDetails.cancelled = true;
    this.dialogRef.close(this.loginDetails);
  }
}

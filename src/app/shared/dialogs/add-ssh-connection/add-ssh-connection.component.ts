import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "add-ssh-connection",
  templateUrl: "./add-ssh-connection.component.html",
  styleUrls: ["./add-ssh-connection.component.scss"],
})
export class AddSshConnectionDialogComponent implements OnInit {
  public sshConnectionForm = new FormGroup({
    name: new FormControl(""),
    address: new FormControl(""),
    port: new FormControl(22),
    username: new FormControl(""),
    password: new FormControl(""),
  });

  constructor(
    public dialogRef: MatDialogRef<AddSshConnectionDialogComponent>
  ) {}

  ngOnInit(): void {}

  public cancel(): void {
    this.dialogRef.close();
  }

  public create(): void {}
}

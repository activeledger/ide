import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { SshService } from "../../services/ssh.service";

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
    nodeLocation: new FormControl(""),
    authMethod: new FormControl("generate"),
    key: new FormControl(""),
  });

  constructor(
    public dialogRef: MatDialogRef<AddSshConnectionDialogComponent>,
    private readonly ssh: SshService
  ) {}

  ngOnInit(): void {}

  get authMethod(): string {
    return this.sshConnectionForm.get("authMethod").value;
  }

  public cancel(): void {
    this.dialogRef.close();
  }

  public async create(): Promise<void> {
    try {
      const inputData = this.sshConnectionForm.value;

      await this.ssh.saveConnection(inputData);
      this.dialogRef.close(true);
    } catch (error) {
      console.log(error);
      this.dialogRef.close(false);
    }
  }
}

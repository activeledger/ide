import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { SshService } from "../../services/ssh.service";
import { ISSH, ISSHCreate } from "../../interfaces/ssh.interface";

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
    public dialogRef: MatDialogRef<AddSshConnectionDialogComponent>,
    private readonly ssh: SshService
  ) {}

  ngOnInit(): void {}

  public cancel(): void {
    this.dialogRef.close();
  }

  public async create(): Promise<void> {
    try {
      const inputData = this.sshConnectionForm.value;

      const sshData: ISSHCreate = {
        name: inputData.name,
        address: inputData.address,
        port: inputData.port,
        username: inputData.username,
        password: inputData.password,
      };

      await this.ssh.saveConnection(sshData);
      this.dialogRef.close(true);
    } catch (error) {
      console.log(error);
      this.dialogRef.close(false);
    }
  }
}

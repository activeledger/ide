import { Component, OnInit } from "@angular/core";
import { SshService } from "../../../../shared/services/ssh.service";
import { ISSH } from "../../../../shared/interfaces/ssh.interface";

@Component({
  selector: "management",
  templateUrl: "./management.component.html",
  styleUrls: ["./management.component.scss"],
})
export class ManagementComponent implements OnInit {
  public connections: ISSH[];
  public node: ISSH;

  constructor(private readonly ssh: SshService) {}

  ngOnInit(): void {
    this.getSshConnections();
  }

  public connect(): void {}

  public getNodeData(connection: ISSH): void {}

  private async getSshConnections(): Promise<void> {
    console.log("Debug");
    try {
      this.connections = await this.ssh.getConnections();
    } catch (error) {
      console.error(error);
    }
    console.log("this.connections");
    console.log(this.connections);
  }
}

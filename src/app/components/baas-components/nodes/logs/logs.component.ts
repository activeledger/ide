import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ISSH } from "../../../../shared/interfaces/ssh.interface";
import { SshService } from "../../../../shared/services/ssh.service";
import { faSyncAlt, faRedoAlt, faBath } from "@fortawesome/pro-light-svg-icons";

@Component({
  selector: "logs",
  templateUrl: "./logs.component.html",
  styleUrls: ["./logs.component.scss"],
})
export class LogsComponent implements OnInit {
  public connection: ISSH;

  public logs = [];

  public autoRefresh = false;

  public icons = {
    autoRefresh: faSyncAlt,
    refresh: faRedoAlt,
    clear: faBath,
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ssh: SshService
  ) {}

  ngOnInit(): void {
    this.getId();
  }

  public toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    console.log(this.autoRefresh);
  }

  private getId(): void {
    this.route.params.subscribe((params) => {
      this.getConnection(params["id"]);
    });
  }

  private async getConnection(id: string): Promise<void> {
    try {
      this.connection = await this.ssh.getConnection(id);
      this.getLogs();
    } catch (error) {
      console.error(error);
    }
  }

  private async getLogs(): Promise<void> {
    if (this.autoRefresh) {
      setTimeout(() => {
        this.getLogs();
      }, 5000);
    }
  }
}

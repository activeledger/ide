import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ViewEncapsulation,
} from "@angular/core";
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

  private nodeId: string;

  constructor(
    private readonly route: ActivatedRoute,
    public readonly ssh: SshService
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
      this.nodeId = params["id"];
    });
  }

  // private async getLogs(): Promise<void> {
  //   if (this.autoRefresh) {
  //     setTimeout(() => {
  //       this.getLogs();
  //     }, 5000);
  //   }
  // }
}

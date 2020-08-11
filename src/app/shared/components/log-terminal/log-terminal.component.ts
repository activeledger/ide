import {
  Component,
  OnInit,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input,
} from "@angular/core";
import { Terminal } from "xterm";
import { SshService } from "../../services/ssh.service";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-log-terminal",
  templateUrl: "./log-terminal.component.html",
  styleUrls: ["./log-terminal.component.scss"],
})
export class LogTerminalComponent implements OnInit, AfterViewInit {
  @ViewChild("terminal") terminalDiv: ElementRef;
  @Input("sshService") sshService: SshService;
  @Input("nodeId") nodeId: string;

  public terminal: Terminal;

  constructor() {}

  ngOnInit(): void {
    this.getConnection();
  }

  ngAfterViewInit(): void {
    this.setupTerminal();
  }

  public setupTerminal() {
    this.terminal = new Terminal();
    this.terminal.open(this.terminalDiv.nativeElement);
    this.terminal.writeln("Log Terminal Initialised, commencing streaming...");
    this.sshService.logEvent.on("logEvent", (data) => {
      const parsed = this.parseData(data.data.toString());

      console.log("parsed");
      console.log(parsed);
      console.log("end parsed\n");

      const regx = new RegExp("\\) = \\d+");

      this.terminal.writeln(parsed);
    });
  }

  private parseData(data: string): string {
    return data.slice(data.indexOf('"') + 1, data.lastIndexOf('"') - 1);
  }

  private async getConnection(): Promise<void> {
    try {
      await this.sshService.sshToNode(this.nodeId);
      this.sshService.streamLogs(this.nodeId);
    } catch (error) {
      console.error(error);
    }
  }
}

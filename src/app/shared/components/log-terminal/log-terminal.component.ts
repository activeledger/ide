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
import { FitAddon } from "xterm-addon-fit";

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
    const fitAddon = new FitAddon();
    this.terminal.loadAddon(fitAddon);
    this.terminal.open(this.terminalDiv.nativeElement);
    fitAddon.fit();

    this.terminal.writeln(
      " > Log Terminal Initialised, commencing streaming..."
    );
    this.sshService.logEvent.on("logEvent", (data) => {
      const parsedArray = this.parseData(data.data.toString());
      const matchRegex = new RegExp("\\)\\s=\\s\\d+");

      for (const parsed of parsedArray) {
        if (!matchRegex.test(parsed)) {
          this.terminal.writeln(" > " + parsed);
        }
      }
    });
  }

  private parseData(data: string): string[] {
    const ansiRegex = /\\\d+\[\d+m/g;
    let parsed = data
      .slice(data.indexOf('"') + 1, data.lastIndexOf('"') - 1)
      .replace(ansiRegex, "");

    let parsedArray = [];

    if (parsed.indexOf("\\r") >= 0 || parsed.indexOf("\\n") >= 0) {
      parsedArray.push(...parsed.split("\\r"));

      for (let i = parsedArray.length; i--; ) {
        let elem = parsedArray[i];

        if (elem === "\\n" || elem === "\\") {
          parsedArray.splice(i, 1);
        } else {
          if (elem.includes("\\n")) {
            parsedArray[i] = elem.replace("\\n", "");
          }

          if (elem[elem.length - 1] === "\\") {
            elem = elem.slice(0, elem.length - 2);
          }
        }
      }
    } else {
      if (parsed[parsed.length - 1] === "\\") {
        parsed = parsed.slice(0, parsed.length - 1);
      }
      parsedArray.push(parsed);
    }

    return parsedArray;
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

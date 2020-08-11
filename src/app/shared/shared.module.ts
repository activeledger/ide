import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LogTerminalComponent } from "./components/log-terminal/log-terminal.component";

@NgModule({
  declarations: [LogTerminalComponent],
  imports: [CommonModule],
  exports: [LogTerminalComponent],
})
export class SharedModule {}

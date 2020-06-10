import { Injectable, Output, EventEmitter } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class MenuService {
  @Output() txBaasSwitchEvent = new EventEmitter<string>();

  constructor() {}

  public txBaasSwitch(state: string): void {
    this.txBaasSwitchEvent.emit(state);
  }
}

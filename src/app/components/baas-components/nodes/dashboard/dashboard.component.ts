import { Component, OnInit } from "@angular/core";
import { DialogService } from "../../../../shared/services/dialog.service";

@Component({
  selector: "dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  public noNodes = false;

  constructor(private readonly dialogService: DialogService) {}

  ngOnInit(): void {}

  addConnection(): void {
    const ref = this.dialogService.addSSHConnection();
  }
}

import { Component, OnInit, Input, Output } from "@angular/core";
import {
  faHome,
  faKey,
  faWrench,
  faBoxOpen,
  faBars,
  faServer,
  faSearch,
  faSitemap,
  faPenNib,
  faAddressBook,
  faCubes,
  faRunning,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Router } from "@angular/router";
import { EventEmitter } from "@angular/core";

@Component({
  selector: "app-mainmenu",
  templateUrl: "./mainmenu.component.html",
  styleUrls: ["./mainmenu.component.scss"],
})
export class MainmenuComponent implements OnInit {
  // Menu Icons
  public burgerIco = faBars;
  public homeIco = faHome;
  public contractsIco = faPenNib;
  public keysIco = faKey;
  public identityIco = faAddressBook;
  public namespacesIco = faBoxOpen;
  public signingIco = faPencilAlt;
  public runIco = faRunning;
  public localNetIco = faServer;
  public streamExploreIco = faSearch;
  public coreApiIco = faCubes;
  public netManageIco = faSitemap;
  public settingsIco = faWrench;

  public setup = {
    console: false,
    hideMenuNames: false,
    isMaximised: true,
  };

  @Input()
  set menuSize(size: string) {
    if (size === "max") {
      this.setup.hideMenuNames = false;
      this.setup.isMaximised = true;
    } else {
      this.setup.hideMenuNames = true;
      this.setup.isMaximised = false;
    }
  }

  @Output() setTitle = new EventEmitter<string>();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  public goTo(url: string, title?: string): void {
    this.router.navigateByUrl(url);
    this.setTitle.emit(title);
  }
}

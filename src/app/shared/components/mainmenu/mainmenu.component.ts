import { Component, OnInit, Input, Output, OnDestroy } from "@angular/core";
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
  faTachometerAlt,
  faNetworkWired,
  faMicrochip,
  faBox,
} from "@fortawesome/free-solid-svg-icons";
import { Router } from "@angular/router";
import { EventEmitter } from "@angular/core";
import { Subscription } from "rxjs";
import { MenuService } from "../../services/menu.service";

@Component({
  selector: "app-mainmenu",
  templateUrl: "./mainmenu.component.html",
  styleUrls: ["./mainmenu.component.scss"],
})
export class MainmenuComponent implements OnInit, OnDestroy {
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
  public dashboardIco = faTachometerAlt;
  public networkIco = faNetworkWired;
  public networkBuilderIco = faBox;
  public nodesIco = faMicrochip;

  public setup = {
    isTx: true,
    hideMenuNames: false,
  };

  public txBaasSwitchSub: Subscription;

  @Input()
  set menuSize(size: string) {
    if (size === "min") {
      this.setup.hideMenuNames = true;
    } else {
      this.setup.hideMenuNames = false;
    }
  }

  @Output() setTitle = new EventEmitter<string>();

  constructor(
    private router: Router,
    private readonly menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.listenForEvents();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.txBaasSwitchSub.unsubscribe();
  }

  public goTo(url: string, title?: string): void {
    this.router.navigateByUrl(url);
    this.setTitle.emit(title);
  }

  private listenForEvents(): void {
    this.txBaasSwitchSub = this.menuService.txBaasSwitchEvent.subscribe(
      (state: string) => {
        this.setup.isTx = state === "tx" ? true : false;
      }
    );
  }
}

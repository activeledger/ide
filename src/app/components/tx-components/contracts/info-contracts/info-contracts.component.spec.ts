import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { InfoContractsComponent } from "./info-contracts.component";

describe("InfoContractsComponent", () => {
  let component: InfoContractsComponent;
  let fixture: ComponentFixture<InfoContractsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoContractsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

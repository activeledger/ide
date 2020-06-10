import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RunSidemenuComponent } from "./run-sidemenu.component";

describe("RunSidemenuComponent", () => {
  let component: RunSidemenuComponent;
  let fixture: ComponentFixture<RunSidemenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RunSidemenuComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunSidemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

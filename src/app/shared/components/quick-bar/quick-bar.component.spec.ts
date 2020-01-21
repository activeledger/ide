import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { QuickBarComponent } from "./quick-bar.component";

describe("QuickBarComponent", () => {
  let component: QuickBarComponent;
  let fixture: ComponentFixture<QuickBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuickBarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

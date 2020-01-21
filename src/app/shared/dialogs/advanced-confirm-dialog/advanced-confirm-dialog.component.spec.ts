import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AdvancedConfirmDialogComponent } from "./advanced-confirm-dialog.component";

describe("AdvancedConfirmDialogComponent", () => {
  let component: AdvancedConfirmDialogComponent;
  let fixture: ComponentFixture<AdvancedConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdvancedConfirmDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

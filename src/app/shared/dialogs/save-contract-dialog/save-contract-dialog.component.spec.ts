import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SaveContractDialogComponent } from "./save-contract-dialog.component";

describe("SaveContractDialogComponent", () => {
  let component: SaveContractDialogComponent;
  let fixture: ComponentFixture<SaveContractDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaveContractDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveContractDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BlockedDialogComponent } from "./blocked-dialog.component";

describe("BlockedDialogComponent", () => {
  let component: BlockedDialogComponent;
  let fixture: ComponentFixture<BlockedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockedDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

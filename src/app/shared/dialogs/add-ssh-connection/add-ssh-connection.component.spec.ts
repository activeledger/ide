import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AddSshConnectionDialogComponent } from "./add-ssh-connection.component";

describe("AddSshConnectionComponent", () => {
  let component: AddSshConnectionDialogComponent;
  let fixture: ComponentFixture<AddSshConnectionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddSshConnectionDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSshConnectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkflowContractsComponent } from "./workflow-contracts.component";

describe("WorkflowContractsComponent", () => {
  let component: WorkflowContractsComponent;
  let fixture: ComponentFixture<WorkflowContractsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkflowContractsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkflowCreateComponent } from "./workflow-create.component";

describe("WorkflowCreateComponent", () => {
  let component: WorkflowCreateComponent;
  let fixture: ComponentFixture<WorkflowCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkflowCreateComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

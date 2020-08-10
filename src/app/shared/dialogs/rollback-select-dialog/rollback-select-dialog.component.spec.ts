import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollbackSelectDialogComponent } from './rollback-select-dialog.component';

describe('RollbackSelectDialogComponent', () => {
  let component: RollbackSelectDialogComponent;
  let fixture: ComponentFixture<RollbackSelectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollbackSelectDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollbackSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SshManageTagsDialogComponent } from './ssh-manage-tags-dialog.component';

describe('SshManageTagsDialogComponent', () => {
  let component: SshManageTagsDialogComponent;
  let fixture: ComponentFixture<SshManageTagsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SshManageTagsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SshManageTagsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

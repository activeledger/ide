import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SshManageTagsConnectionDialogComponent } from './ssh-manage-tags-connection-dialog.component';

describe('SshManageTagsConnectionDialogComponent', () => {
  let component: SshManageTagsConnectionDialogComponent;
  let fixture: ComponentFixture<SshManageTagsConnectionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SshManageTagsConnectionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SshManageTagsConnectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

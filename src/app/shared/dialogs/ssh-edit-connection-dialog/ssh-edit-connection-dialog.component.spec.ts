import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SshEditConnectionDialogComponent } from './ssh-edit-connection-dialog.component';

describe('SshEditConnectionDialogComponent', () => {
  let component: SshEditConnectionDialogComponent;
  let fixture: ComponentFixture<SshEditConnectionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SshEditConnectionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SshEditConnectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SshLoginDialogComponent } from './ssh-login-dialog.component';

describe('SshLoginDialogComponent', () => {
  let component: SshLoginDialogComponent;
  let fixture: ComponentFixture<SshLoginDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SshLoginDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SshLoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

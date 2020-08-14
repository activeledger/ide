import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogTerminalComponent } from './log-terminal.component';

describe('LogTerminalComponent', () => {
  let component: LogTerminalComponent;
  let fixture: ComponentFixture<LogTerminalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogTerminalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

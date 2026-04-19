import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { getTranslocoModule } from '@shared/utils/transloco-testing.module';
import { ChatCopilotComponent } from './chat-copilot.component';

describe('ChatCopilotComponent', () => {
  let component: ChatCopilotComponent;
  let fixture: ComponentFixture<ChatCopilotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatCopilotComponent, RouterModule.forRoot([]), getTranslocoModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatCopilotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start closed with no messages', () => {
    expect(component.isOpen).toBeFalse();
    expect(component.messages.length).toBe(0);
  });

  it('should emit closed event on close', () => {
    spyOn(component.closed, 'emit');
    component.close();
    expect(component.closed.emit).toHaveBeenCalled();
  });

  it('should toggle history panel', () => {
    expect(component.historyOpen).toBeFalse();
    component.toggleHistory();
    expect(component.historyOpen).toBeTrue();
    component.toggleHistory();
    expect(component.historyOpen).toBeFalse();
  });

  it('should clear chat and reset state', () => {
    component.waiting = true;
    component.timedOut = true;
    component.messages = [{ role: 'user', content: 'hi', displayedContent: 'hi', read: true, typing: false }];
    component.clearChat();
    expect(component.messages.length).toBe(0);
    expect(component.waiting).toBeFalse();
    expect(component.timedOut).toBeFalse();
  });

  it('should create new chat and close history', () => {
    component.historyOpen = true;
    component.messages = [{ role: 'user', content: 'hi', displayedContent: 'hi', read: true, typing: false }];
    component.newChat();
    expect(component.messages.length).toBe(0);
    expect(component.historyOpen).toBeFalse();
  });

  it('should report hasOlderMessages correctly', () => {
    expect(component.hasOlderMessages).toBeFalse();
  });
});

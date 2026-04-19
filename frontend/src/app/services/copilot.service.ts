import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@env';

/** Shape of a single exchange in the PromptFlow chat history. */
export interface CopilotHistoryEntry {
  inputs: { chat_input: string };
  outputs: { chat_output: string };
}

interface CopilotRequest {
  chat_input: string;
  chat_history: CopilotHistoryEntry[];
}

interface CopilotResponse {
  chat_output: string;
}

@Injectable({ providedIn: 'root' })
export class CopilotService {
  private readonly http = inject(HttpClient);

  /**
   * Send a message to the backend copilot proxy which forwards it
   * to the Azure ML PromptFlow endpoint. API keys stay server-side.
   */
  chat(message: string, history: CopilotHistoryEntry[]): Observable<string> {
    const body: CopilotRequest = {
      chat_input: message,
      chat_history: history,
    };

    return this.http
      .post<CopilotResponse>(`${environment.apiUrl}/copilot/chat`, body)
      .pipe(map((res) => res.chat_output));
  }
}

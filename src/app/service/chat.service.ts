import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SessionChatRequest} from "../model/SessionChatRequest";
import {UserSession} from "../model/SessionChatResponse";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly url: string;

  constructor(private http: HttpClient) {
    this.url = `http://localhost:8080/api/`;
  }

  public send(message: string): Observable<string> {
    return this.http.put<string>(this.url + localStorage.getItem('fakeUserId'), message);
  }

  public startSessionWithAgent(request: SessionChatRequest): Observable<UserSession> {
    return this.http.post<UserSession>(this.url + "start-session", request);
  }
}

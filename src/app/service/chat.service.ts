import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SessionChatRequest} from "../model/SessionChatRequest";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly url: string;

  constructor(private http: HttpClient) {
    this.url = `http://localhost:8080/api/${localStorage.getItem('fakeUserId')}`;
  }

  public send(message: string): Observable<string> {
    return this.http.put<string>(this.url, message);
  }

  // public findAll() {
  //   return this.http.get<any>(this.url);
  // }

  public startSessionWithAgent(request: SessionChatRequest) {
    return this.http.post<string>(this.url, request).subscribe(data => {
    });
  }
}

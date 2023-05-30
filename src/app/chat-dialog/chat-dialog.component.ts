import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChatService} from "../service/chat.service";
import {SessionChatRequest} from "../model/SessionChatRequest";
import {SessionChatResponse} from "../model/SessionChatResponse";

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss']
})
export class ChatDialogComponent implements OnInit {
  public isChatVisible: boolean = true;
  request: SessionChatRequest = new SessionChatRequest();
  public response: SessionChatResponse = new SessionChatResponse();

  @ViewChild('chatListContainer') list?: ElementRef<HTMLDivElement>;
  chatInputMessage: string = "";
  human = {
    id: 1,
    imageDir: 'assets/images/user.png'
  }
  bot = {
    id: 2,
    imageDir: 'assets/images/chatbot.png'
  }
  chatMessages: {
    user: any,
    message: string
  }[] = [
    {
      user: this.bot,
      message: "Welcome to Gumtree Chatbot! " +
        "I'm here to assist you and answer any questions you may have. " +
        "Whether you need help with product information, support inquiries, or general assistance. " +
        "I'll do my best to provide you with relevant and helpful information. Let's get started! "
    },
  ];

  constructor(public chatService: ChatService) {
  }

  ngOnInit() {
    if (localStorage.getItem('fakeUserId') === null) {
      localStorage.setItem('fakeUserId', this.generateFakeId())
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom()
  }

  sendMessage() {
    this.chatMessages.push({
      message: this.chatInputMessage,
      user: this.human
    });
    this.chatService.send(this.chatInputMessage).subscribe(data => {
      this.receiveMessage(data);
    });
    this.chatInputMessage = ""
    this.scrollToBottom()
  }

  receiveMessage(message: string) {
    let newName: string | undefined = "";

    if (message.includes('Your chatting to Stacey, How may i help you')) {
      this.request.sessionId = this.generateFakeId();
      this.request.agentId = this.getRandomAvailableAgent(1, 4);

      this.chatService.startSessionWithAgent(this.request).subscribe(data => {
        console.log("Response return: " + data.name)
        this.response = data
        newName = data.name;

        this.chatMessages.push({
          message: this.getMessage(message, newName),
          user: this.bot
        });

      });
    } else {
      this.chatMessages.push({
        message: this.getMessage(message, newName),
        user: this.bot
      });
    }

    this.scrollToBottom()
  }

  scrollToBottom() {
    const maxScroll = this.list?.nativeElement.scrollHeight;
    this.list?.nativeElement.scrollTo({top: maxScroll, behavior: 'smooth'});
  }

  generateFakeId(): string {
    const current = new Date();
    const timestamp = current.getTime();
    return timestamp.toString()
  }

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
  }

  getRandomAvailableAgent(min: number, max: number) {
    return Math.floor(min + Math.random()*(max - min + 1))
  }

  getMessage(message: string, name: string | undefined) {
    console.log("new name" + name)
    console.log("Message" + message)
    return message.includes("Stacey") ? message.replace("Stacey", <string>name) : message;
  }
}

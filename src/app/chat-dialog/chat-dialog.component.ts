import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChatService} from "../service/chat.service";

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss']
})
export class ChatDialogComponent implements OnInit {
  public isChatVisible: boolean = true;
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

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    if (localStorage.getItem('fakeUserId') === null) {
      localStorage.setItem('fakeUserId', this.generateFakeId())
    } else {
      this.chatService.findAll().subscribe(data => {
        if (data !== null) {
          this.setConversation(data['conversation'])
        }
      });
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
    this.chatMessages.push({
      message: message,
      user: this.bot
    });
    this.scrollToBottom()
  }

  setConversation(conversation: any) {
    for (let i = 0; i < conversation.length; i++) {
      if (i % 2 === 0) {
        this.chatMessages.push({
          message: conversation[i],
          user: this.human
        });
      } else {
        this.chatMessages.push({
          message: conversation[i],
          user: this.bot
        });
      }
    }
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
}

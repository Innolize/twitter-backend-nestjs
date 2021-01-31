import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { SocketService } from "./socket/socket.service";

@WebSocketGateway({ transports: ["websocket"] })
@Injectable()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private socketService: SocketService,
    private configService: ConfigService
  ) {}

  private count = 0;

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    this.socketService.socket = server;
  }

  handleConnection() {
    this.count += 1;
    console.log(`connected: ${this.count}  users`);
    this.server.emit("msgToClient", "conectado con exito!");
  }

  handleDisconnect() {
    this.count -= 1;
    console.log(`connected: ${this.count}  users`);
  }

  @SubscribeMessage("joinRoom")
  joinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.join(room);
  }
}

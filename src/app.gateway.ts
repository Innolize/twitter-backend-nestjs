import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io'

@WebSocketGateway(4001, { transports: ['websocket'] })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server

  private count: number = 0

  handleConnection(client: Socket) {
    this.count += 1
    console.log(`connected: ${this.count}  users`)
    this.server.emit('msgToClient', "conectado con exito!");
  }

  handleDisconnect() {
    this.count -= 1
    console.log(`connected: ${this.count}  users`)
  }

  newComment(roomId: string, data: any) {
    console.log('nuevo comentario')
    this.server.to(roomId).emit('newComment', data)
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.join(room)
  }
}

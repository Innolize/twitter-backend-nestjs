import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io'

@Injectable()
export class SocketService {
    public socket: Server = null

    newComment(roomId: string, data: any) {
        console.log('nuevo comentario')
        this.socket.to(roomId).emit('newComment', data)
    }

}

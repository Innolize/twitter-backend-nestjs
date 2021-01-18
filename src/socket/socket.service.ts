import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io'
import { Post } from 'src/post/interfaces/post.interface';

@Injectable()
export class SocketService {
    public socket: Server = null

    newComment(roomId: string, data: any) {
        console.log('nuevo Comentario')
        this.socket.to(roomId).emit('newComment', data)
    }
    newPost(data: Post) {
        console.log('nuevo Post')
        this.socket.to('general').emit('newPost', data)
    }
}

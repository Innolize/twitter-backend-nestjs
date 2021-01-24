import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io'
import { CommentInterface } from 'src/comment/schemas/comment.schema';
import { Post } from 'src/post/interfaces/post.interface';

@Injectable()
export class SocketService {
    public socket: Server = null

    //Post

    newPost(post: Post) {
        console.log('nuevo Post')
        this.socket.to('general').emit('newPost', post)
    }

    removePost(post: Post) {
        this.socket.to('general').emit('removePost', post)
    }

    //Comments

    newComment(roomId: string, data: any) {
        console.log('nuevo Comentario')
        this.socket.to(roomId).emit('newComment', data)
    }
    updateComment(postId: string, data: any) {
        this.socket.to(postId).emit('updateComment', data)
    }
    removeComment(postId: string, commentId: any) {
        this.socket.to(postId).emit('removeComment', commentId)
    }
}

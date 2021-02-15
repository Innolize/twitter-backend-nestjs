import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io'
import { CommentInterface } from 'src/comment/schemas/comment.schema';
import { Post } from 'src/post/interfaces/post.interface';

@Injectable()
export class SocketService {
    public socket: Server = null

    //Post General

    newPost(post: Post) {
        console.log('nuevo Post')
        this.socket.to('general').emit('newPost', post)
    }

    updatePost(post: Post) {
        this.socket.to('general').emit('updatePost', post)
    }

    removePost(post: Post) {
        this.socket.to('general').emit('removePost', post)
    }

    //Post Specific

    updateSpecificPost(post: Post) {
        this.socket.to(post._id).emit('updateSpecificPost', post)
    }

    //Comments

    newComment(roomId: string, data: any) {
        console.log('nuevo Comentario')
        this.socket.to(roomId).emit('newComment', data)
    }
    updateCommentArray(postId: string, data: any) {
        this.socket.to(postId).emit('updateCommentArray', data)
    }
    removeCommentArray(postId: string, commentId: any) {
        this.socket.to(postId).emit('removeCommentArray', commentId)
    }
}

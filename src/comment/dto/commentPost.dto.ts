import { IsString } from "class-validator";

export class findByPostDTO {
    @IsString()
    postId: string
}
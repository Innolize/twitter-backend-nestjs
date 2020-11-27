import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';

describe('PostController', () => {
  let postController: PostController;
  let postService: PostService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PostService]
    }).compile();

    postController = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);

  });

  // it('should be defined', () => {
  //   expect(postController).toBeDefined();
  // });

});

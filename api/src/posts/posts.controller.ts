import {
  Controller,
  Get,
  Post as HttpPost,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService } from './posts.service';
import { CreatePostDto, EditPostDto } from './dtos/post.dto';
import { CommentDto, EditCommentDto } from './dtos/comment.dto';


@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @HttpPost()
  createPost(@Request() req, @Body() dto: CreatePostDto) {
    return this.postsService.createPost(
      req.user.userId,
      dto.content,
      dto.medias,
    );
  }

  @Get()
  getAll() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.postsService.getPostById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  editPost(@Request() req, @Param('id') id: number, @Body() dto: EditPostDto) {
    return this.postsService.editPost(req.user.userId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deletePost(@Request() req, @Param('id') id: number) {
    return this.postsService.deletePost(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @HttpPost(':id/like')
  toggleLike(@Request() req, @Param('id') id: number) {
    return this.postsService.toggleLike(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @HttpPost(':id/comment')
  addComment(@Request() req, @Param('id') id: number, @Body() dto: CommentDto) {
    return this.postsService.addComment(
      req.user.userId,
      id,
      dto.content,
      dto.parent_id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('comment/:commentId')
  editComment(
    @Request() req,
    @Param('commentId') commentId: number,
    @Body() dto: EditCommentDto,
  ) {
    return this.postsService.editComment(
      req.user.userId,
      commentId,
      dto.content,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('comment/:commentId')
  deleteComment(@Request() req, @Param('commentId') commentId: number) {
    return this.postsService.deleteComment(req.user.userId, commentId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('user/me')
  getMyPosts(@Request() req) {
    return this.postsService.getMyPosts(req.user.userId);
  }

  @Get('user/:username')
  getPostsByUser(@Param('username') username: string) {
    return this.postsService.getPostsByUsername(username);
  }
}

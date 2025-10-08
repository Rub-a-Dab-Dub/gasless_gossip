import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Like) private likeRepo: Repository<Like>,
  ) {}

  // Create a post
  async createPost(userId: number, content: string, medias?: string[]) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const post = this.postRepo.create({ content, medias, author: user });
    return this.postRepo.save(post);
  }

  // Get all posts
  async getAllPosts() {
    return this.postRepo.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  // Get one post by id (with comments & nested replies)
  async getPostById(postId: number) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: [
        'author',
        'comments',
        'comments.author',
        'comments.replies',
        'comments.replies.author',
        'likes',
      ],
    });
    if (!post) throw new NotFoundException('Post not found');

    return post;
  }

  // Edit a post
  async editPost(
    userId: number,
    postId: number,
    data: { content?: string; medias?: string[] },
  ) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['author'],
    });
    if (!post) throw new NotFoundException('Post not found');

    if (post.author.id !== userId) {
      throw new ForbiddenException('You are not allowed to edit this post');
    }

    if (data.content !== undefined) post.content = data.content;
    if (data.medias !== undefined) post.medias = data.medias;

    return this.postRepo.save(post);
  }

  // Delete post
  async deletePost(userId: number, postId: number) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['author'],
    });
    if (!post) throw new NotFoundException('Post not found');

    if (post.author.id !== userId) {
      throw new ForbiddenException('You are not allowed to delete this post');
    }

    await this.postRepo.remove(post);
    return { message: 'Post deleted' };
  }

  // Toggle like / unlike
  async toggleLike(userId: number, postId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.likeRepo.findOne({
      where: {
        user: { id: user.id },
        post: { id: post.id },
      },
    });

    if (existing) {
      // Unlike
      await this.likeRepo.remove(existing);
      return { message: 'Post unliked' };
    } else {
      // Like
      const like = this.likeRepo.create({ user, post });
      await this.likeRepo.save(like);
      return { message: 'Post liked' };
    }
  }

  // Add comment or reply
  async addComment(
    userId: number,
    postId: number,
    content: string,
    parentId?: number,
  ) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    let parent: Comment | null = null;
    if (parentId) {
      parent = await this.commentRepo.findOne({
        where: { id: parentId },
        relations: ['post'],
      });
      if (!parent) throw new NotFoundException('Parent comment not found');
      if (parent.post.id !== postId) {
        throw new ForbiddenException(
          'Parent comment not associated with this post',
        );
      }
    }

    const comment = this.commentRepo.create({
      content,
      author: user,
      post,
      parent: parent ?? undefined,
    });
    return this.commentRepo.save(comment);
  }

  // Edit comment
  async editComment(userId: number, commentId: number, newContent: string) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['author'],
    });
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.author.id !== userId) {
      throw new ForbiddenException('You cannot edit this comment');
    }

    comment.content = newContent;
    return this.commentRepo.save(comment);
  }

  // Delete comment (and its replies)
  async deleteComment(userId: number, commentId: number) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['author', 'replies'],
    });
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.author.id !== userId) {
      throw new ForbiddenException('You cannot delete this comment');
    }

    await this.commentRepo.remove(comment);
    return { message: 'Comment deleted' };
  }

  // Get all posts by username
  async getPostsByUsername(username: string) {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) throw new NotFoundException('User not found');

    return this.postRepo.find({
      where: { author: { id: user.id } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  // Get my posts
  async getMyPosts(userId: number) {
    return this.postRepo.find({
      where: { author: { id: userId } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }
}

teDto } from './dto/reaction-update.dto';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ReactionsTrackerService } from './reactions-tracker.service';
import { ReactionUpda
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'reactions',
})
export class ReactionsTrackerGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ReactionsTrackerGateway.name);

  constructor(private readonly reactionsTrackerService: ReactionsTrackerService) {}

  @SubscribeMessage('addReaction')
  async handleAddReaction(
    @MessageBody() reactionUpdate: ReactionUpdateDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const updatedTrack = await this.reactionsTrackerService.aggregateReaction(reactionUpdate);
      
      // Broadcast the update to all connected clients
      this.server.emit('reactionUpdated', {
        messageId: updatedTrack.messageId,
        totalCount: updatedTrack.totalCount,
        likeCount: updatedTrack.likeCount,
        loveCount: updatedTrack.loveCount,
        laughCount: updatedTrack.laughCount,
        angryCount: updatedTrack.angryCount,
        sadCount: updatedTrack.sadCount,
        updatedAt: updatedTrack.updatedAt,
      });

      this.logger.log(`Reaction added for message ${reactionUpdate.messageId}`);
    } catch (error) {
      this.logger.error('Error handling add reaction', error);
      client.emit('error', { message: 'Failed to add reaction' });
    }
  }

  @SubscribeMessage('removeReaction')
  async handleRemoveReaction(
    @MessageBody() reactionUpdate: ReactionUpdateDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const updatedTrack = await this.reactionsTrackerService.removeReaction(reactionUpdate);
      
      // Broadcast the update to all connected clients
      this.server.emit('reactionUpdated', {
        messageId: updatedTrack.messageId,
        totalCount: updatedTrack.totalCount,
        likeCount: updatedTrack.likeCount,
        loveCount: updatedTrack.loveCount,
        laughCount: updatedTrack.laughCount,
        angryCount: updatedTrack.angryCount,
        sadCount: updatedTrack.sadCount,
        updatedAt: updatedTrack.updatedAt,
      });

      this.logger.log(`Reaction removed for message ${reactionUpdate.messageId}`);
    } catch (error) {
      this.logger.error('Error handling remove reaction', error);
      client.emit('error', { message: 'Failed to remove reaction' });
    }
  }
}

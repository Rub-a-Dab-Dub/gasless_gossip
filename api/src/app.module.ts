import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { CommonModule } from './common/common.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { RoomCategoriesModule } from './room-categories/room-categories.module';
import { RoomMessagesModule } from './room-messages/room-messages.module';
import { RoomsModule } from './rooms/rooms.module';
import starknetConfig from './config/starknet.config';
import { ContractsModule } from './contracts/contracts.module';
import { WalletModule } from './wallets/wallet.module';
import { QueueModule } from './queue/queue.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [starknetConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT) || 3000,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // set to false in production
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    ChatsModule,
    CommonModule,
    MessagesModule,
    RoomCategoriesModule,
    RoomMessagesModule,
    RoomsModule,
    ContractsModule,
    WalletModule,
    ContractsModule,
    QueueModule,
  ],
})
export class AppModule {}

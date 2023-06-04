import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';


@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, PostsController, AuthController],
  providers: [AppService, PostsService, AuthService],
})
export class AppModule {}

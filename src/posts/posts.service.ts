import { SharePostDto } from './dto/posts-share.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, OpenAIApi } from 'openai';
import axios from 'axios';
import { globalVariable } from 'src/global/global';

@Injectable()
export class PostsService {
  private openai: OpenAIApi;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const configuration = new Configuration({
      organization: 'org-oyGJgWrLh8lYCJF01HvjlHYw',
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async generate() {
    try {
      const response = await this.openai.createCompletion({
        model: 'text-davinci-003',
        prompt: 'Fais moi une blague.',
        max_tokens: 200,
        temperature: 0.5,
        n: 1,
      });

      return response.data.choices[0];
    } catch (err: any) {
      return err.response;
    }
  }

  async shareOnLinkedIn(postContent: SharePostDto) {
    const shareContent = {
      author: `urn:li:person:${globalVariable.personURN}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: 'THIS IS A POST!',
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    try {
      const response = await axios.post(
        'https://api.linkedin.com/v2/ugcPosts',
        shareContent,
        {
          headers: {
            'X-Restli-Protocol-Version': '2.0.0',
            Authorization: `Bearer ${globalVariable.accessToken}`,
          },
        },
      );

      console.log('Share posted successfully:', response.data);
    } catch (error) {
      console.error('Error posting share:', error);
    }
  }
}

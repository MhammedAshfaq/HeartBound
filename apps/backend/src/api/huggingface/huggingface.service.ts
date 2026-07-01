import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import OpenAI from 'openai';
import { InferenceClient } from "@huggingface/inference";

@Injectable()
export class HuggingFaceService {
  // private readonly client: OpenAI;
  private hf: InferenceClient;
  private readonly logger = new Logger(HuggingFaceService.name);

  // Default model from HuggingFace router docs
  private readonly DEFAULT_MODEL = 'zai-org/GLM-5.2:novita';

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('HF_TOKEN');

    if (!token) {
      throw new Error('HF_TOKEN is missing in environment');
    }

//     const client = new OpenAI({
// 	baseURL: "https://router.huggingface.co/v1",
// 	apiKey: process.env.HF_TOKEN,
// });
    this.hf = new InferenceClient(token)
    // this.hf = new HfInference(token);
  }

  async generateText(prompt: string, model?: string) {
    try {
      console.log("------ HF API Called ------")
      console.log("*****", this.configService.get<string>('HF_TOKEN'))
      console.log("------ PROMPT ------", prompt)
      console.log("------ MODEL ------", model)
      const selectedModel =
        model ||
        this.configService.get<string>('HF_DEFAULT_MODEL') ||
        this.DEFAULT_MODEL;

      console.log("------ Selected Model ------", selectedModel)

//       const chatCompletion = await this.client.chat.completions.create({
//   model: selectedModel,
//   messages: [
//     { role: 'user', content: prompt },
//   ],
//   max_tokens: 200,       // 👈 LIMIT OUTPUT
//   temperature: 0.7,
// });
      const chatCompletion = await this.hf.chatCompletion({
        model: selectedModel,
        messages: [
          { role: 'user', content: prompt },
        ],
        parameters: {
          max_new_tokens: 200,
        },
      });

      console.log("------ Chat Completion ------", chatCompletion)

      return {
        success: true,
        data: chatCompletion,
      };
    } catch (error) {
      this.logger.error('HF API Error', error);

      return {
        success: false,
        message: 'Failed to generate text',
      };
    }
  }
}
import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

export interface AiResponse {
  answer: string;
  confidence: number;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openai: OpenAI;

  private readonly embeddingModel: string;
  private readonly chatModel: string;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.embeddingModel =
      process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small';
    this.chatModel = process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o-mini';
  }

  /**
   * Creates a vector embedding for the given text.
   * Returns a number[] (1536 dimensions for text-embedding-3-small).
   */
  async createEmbedding(text: string): Promise<number[]> {
    this.logger.debug(`Creating embedding for text (${text.length} chars)`);

    const response = await this.openai.embeddings.create({
      model: this.embeddingModel,
      input: text,
    });

    return response.data[0].embedding;
  }

  /**
   * Generates an AI answer based on retrieved context chunks and user question.
   * Returns a structured { answer, confidence } object.
   */
  async generateResponse(
    context: string[],
    question: string,
    organizationContext?: string,
  ): Promise<AiResponse> {
    this.logger.debug(`Generating response for question: "${question}"`);

    const contextBlock = context
      .map((chunk, i) => `[${i + 1}] ${chunk}`)
      .join('\n\n');

    const systemPrompt = `You are a helpful customer support AI assistant.
${organizationContext ? `Company context: ${organizationContext}` : ''}

Answer the user's question using ONLY the provided knowledge base context below.
If the context does not contain enough information, say so honestly.

Always respond in valid JSON with this exact shape:
{
  "answer": "<your answer here>",
  "confidence": <integer 0–100>
}

Confidence guide:
- 90–100: Context directly and fully answers the question
- 70–89:  Context partially answers the question
- 40–69:  Context is loosely related
- 0–39:   Context does not answer the question`;

    const userPrompt = `Knowledge base context:
${contextBlock}

User question:
${question}`;

    const completion = await this.openai.chat.completions.create({
      model: this.chatModel,
      temperature: 0.2,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0].message.content ?? '{}';

    try {
      const parsed = JSON.parse(raw) as AiResponse;
      return {
        answer: parsed.answer ?? 'No answer generated.',
        confidence: Math.min(100, Math.max(0, parsed.confidence ?? 0)),
      };
    } catch {
      this.logger.error('Failed to parse AI response JSON', raw);
      return { answer: raw, confidence: 0 };
    }
  }
}
import { Injectable, Logger } from '@nestjs/common';
import { AiService, AiResponse } from '../ai/ai.service';
import { KnowledgeService, RelevantDocument } from '../knowledge/knowledge.service';

export interface GenerateAnswerResult {
  answer: string;
  confidence: number;
  sources: RelevantDocument[];
  hasRelevantContext: boolean;
}

@Injectable()
export class AiAnswerService {
  private readonly logger = new Logger(AiAnswerService.name);

  constructor(
    private readonly aiService: AiService,
    private readonly knowledgeService: KnowledgeService,
  ) {}

  async generateAnswer(
    organizationId: string,
    question: string,
    organizationContext?: string,
  ): Promise<GenerateAnswerResult> {
    this.logger.log(`Generating answer for org: ${organizationId}`);
    this.logger.debug(`Question: "${question}"`);

    const relevantDocs = await this.knowledgeService.findRelevantDocumentsByText(
      organizationId,
      question,
    );

    this.logger.debug(`Found ${relevantDocs.length} relevant documents`);

    if (relevantDocs.length === 0) {
      this.logger.warn(`No relevant context found for question: "${question}"`);
      return {
        answer:
          'I was unable to find relevant information in the knowledge base to answer this question. A support agent will assist you shortly.',
        confidence: 0,
        sources: [],
        hasRelevantContext: false,
      };
    }

    const contextChunks = relevantDocs.map((doc) => doc.content);

    let aiResponse: AiResponse;
    try {
      aiResponse = await this.aiService.generateResponse(
        contextChunks,
        question,
        organizationContext,
      );
    } catch (err: any) {
      this.logger.error(`GPT call failed: ${err.message}`);
      return {
        answer: 'An error occurred while generating the answer. Please try again.',
        confidence: 0,
        sources: relevantDocs,
        hasRelevantContext: true,
      };
    }

    this.logger.log(
      `Answer generated – confidence: ${aiResponse.confidence}%`,
    );

    return {
      answer: aiResponse.answer,
      confidence: aiResponse.confidence,
      sources: relevantDocs,
      hasRelevantContext: true,
    };
  }

  determineTicketStatus(confidence: number, threshold: number = 90): 'auto_answered' | 'pending_agent' {
    const status = confidence >= threshold ? 'auto_answered' : 'pending_agent';

    this.logger.debug(
      `Confidence ${confidence}% vs threshold ${threshold}% → status: "${status}"`,
    );

    return status;
  }
}
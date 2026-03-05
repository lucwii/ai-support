import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { SupabaseService } from '../supabase/supabase.service';

export interface ChunkResult {
  chunk: string;
  index: number;
  embeddingCreated: boolean;
}

export interface UploadKnowledgeResult {
  totalChunks: number;
  savedChunks: number;
  chunks: ChunkResult[];
}

export interface RelevantDocument {
  id: string;
  content: string;
  similarity: number;
}

@Injectable()
export class KnowledgeService {
  private readonly logger = new Logger(KnowledgeService.name);

  private readonly CHUNK_SIZE = 800;
  private readonly CHUNK_OVERLAP = 100;

  // Koliko top chunkova vraćamo GPT-u kao kontekst
  private readonly TOP_K = 5;

  // Minimalna sličnost – ispod ovoga chunk se ignoriše (0–1 skala)
  private readonly SIMILARITY_THRESHOLD = 0.5;

  constructor(
    private readonly aiService: AiService,
    private readonly supabaseService: SupabaseService,
  ) {}


  async findRelevantDocuments(
    organizationId: string,
    embedding: number[],
  ): Promise<RelevantDocument[]> {
    this.logger.debug(
      `Searching relevant documents for org: ${organizationId}`,
    );

    const { data, error } = await this.supabaseService.db.rpc(
      'match_knowledge_embeddings',
      {
        query_embedding: JSON.stringify(embedding),
        match_organization_id: organizationId,
        match_threshold: this.SIMILARITY_THRESHOLD,
        match_count: this.TOP_K,
      },
    );

    if (error) {
      this.logger.error(`Similarity search failed: ${error.message}`);
      return [];
    }

    if (!data || data.length === 0) {
      this.logger.warn(`No relevant documents found for org: ${organizationId}`);
      return [];
    }

    this.logger.debug(`Found ${data.length} relevant documents`);

    return (data as any[]).map((row) => ({
      id: row.id,
      content: row.content,
      similarity: row.similarity,
    }));
  }

  /**
   * Convenience metoda – prima tekst pitanja, interno kreira embedding,
   * pa poziva findRelevantDocuments.
   * Koristiće je TicketsService direktno u Ticket 5.
   */
  async findRelevantDocumentsByText(
    organizationId: string,
    questionText: string,
  ): Promise<RelevantDocument[]> {
    const embedding = await this.aiService.createEmbedding(questionText);
    return this.findRelevantDocuments(organizationId, embedding);
  }



  async uploadKnowledge(
    organizationId: string,
    content: string,
  ): Promise<UploadKnowledgeResult> {
    const chunks = this.splitIntoChunks(content);
    this.logger.log(
      `Split content into ${chunks.length} chunks for org: ${organizationId}`,
    );

    const results: ChunkResult[] = [];
    let savedChunks = 0;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      try {
        const embedding = await this.aiService.createEmbedding(chunk);

        const { error } = await this.supabaseService.db
          .from('knowledge_embeddings')
          .insert({
            organization_id: organizationId,
            content: chunk,
            embedding: JSON.stringify(embedding),
          });

        if (error) {
          this.logger.error(`Failed to save chunk ${i}: ${error.message}`);
          results.push({ chunk, index: i, embeddingCreated: false });
        } else {
          savedChunks++;
          results.push({ chunk, index: i, embeddingCreated: true });
          this.logger.debug(`Saved chunk ${i + 1}/${chunks.length}`);
        }
      } catch (err) {
        this.logger.error(`Error processing chunk ${i}: ${err.message}`);
        results.push({ chunk, index: i, embeddingCreated: false });
      }
    }

    return { totalChunks: chunks.length, savedChunks, chunks: results };
  }

  splitIntoChunks(text: string): string[] {
    const chunks: string[] = [];
    const normalized = text.replace(/\r\n/g, '\n').trim();
    let start = 0;

    while (start < normalized.length) {
      let end = start + this.CHUNK_SIZE;

      if (end < normalized.length) {
        const lastPeriod = normalized.lastIndexOf('.', end);
        const lastNewline = normalized.lastIndexOf('\n', end);
        const naturalBreak = Math.max(lastPeriod, lastNewline);

        if (naturalBreak > start + this.CHUNK_SIZE / 2) {
          end = naturalBreak + 1;
        }
      }

      const chunk = normalized.slice(start, end).trim();
      if (chunk.length > 0) chunks.push(chunk);
      start = end - this.CHUNK_OVERLAP;
    }

    return chunks;
  }
}
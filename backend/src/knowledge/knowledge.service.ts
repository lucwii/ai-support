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

@Injectable()
export class KnowledgeService {
  private readonly logger = new Logger(KnowledgeService.name);

  // Chunk size u karakterima – 800 je sweet spot između konteksta i preciznosti
  private readonly CHUNK_SIZE = 800;
  // Overlap između chunkova – 100 karaktera da ne izgubimo kontekst na rubovima
  private readonly CHUNK_OVERLAP = 100;

  constructor(
    private readonly aiService: AiService,
    private readonly supabaseService: SupabaseService,
  ) {}

  /**
   * Glavni flow:
   * 1. Podeli tekst na chunkove
   * 2. Za svaki chunk kreiraj embedding
   * 3. Upiši u knowledge_embeddings
   */
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

    // Procesujemo sekvencijalno da ne bombardujemo OpenAI API
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      try {
        // Korak 1: Kreiraj embedding za chunk
        const embedding = await this.aiService.createEmbedding(chunk);

        // Korak 2: Upiši u Supabase
        // embedding mora biti kao string '[0.1, 0.2, ...]' za pgvector
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

    this.logger.log(`Upload complete: ${savedChunks}/${chunks.length} chunks saved`);

    return {
      totalChunks: chunks.length,
      savedChunks,
      chunks: results,
    };
  }

  /**
   * Seče tekst na chunkove sa overlapom.
   *
   * Zašto overlap?
   * Ako se rečenica nalazi na granici dva chunka, bez overlapa
   * bi bila "isečena" i embedding bi izgubio kontekst.
   *
   * Primer sa CHUNK_SIZE=800, OVERLAP=100:
   * chunk[0] = chars 0–800
   * chunk[1] = chars 700–1500
   * chunk[2] = chars 1400–2200
   */
  splitIntoChunks(text: string): string[] {
    const chunks: string[] = [];
    const normalized = text.replace(/\r\n/g, '\n').trim();

    let start = 0;

    while (start < normalized.length) {
      let end = start + this.CHUNK_SIZE;

      // Ako nismo na kraju teksta, pokušaj da završiš na kraju rečenice
      // da ne sečemo usred reči/misli
      if (end < normalized.length) {
        const lastPeriod = normalized.lastIndexOf('.', end);
        const lastNewline = normalized.lastIndexOf('\n', end);
        const naturalBreak = Math.max(lastPeriod, lastNewline);

        // Koristi prirodni prelom samo ako nije previše daleko nazad
        if (naturalBreak > start + this.CHUNK_SIZE / 2) {
          end = naturalBreak + 1;
        }
      }

      const chunk = normalized.slice(start, end).trim();
      if (chunk.length > 0) {
        chunks.push(chunk);
      }

      // Sledeći chunk počinje sa overlapom unazad
      start = end - this.CHUNK_OVERLAP;
    }

    return chunks;
  }
}
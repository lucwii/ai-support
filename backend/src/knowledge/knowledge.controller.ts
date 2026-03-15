import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { CreateKnowledgeDto } from './dto/create-knowledge.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('knowledge')
@UseGuards(AuthGuard)
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  /**
   * GET /knowledge?organization_id=xxx
   * Vraća sve knowledge chunkove za organizaciju.
   */
  @Get()
  async getKnowledge(@Query('organization_id') organizationId: string) {
    if (!organizationId) {
      throw new BadRequestException('organization_id is required');
    }

    const data = await this.knowledgeService.getKnowledge(organizationId);

    return {
      success: true,
      data,
    };
  }

  /**
   * DELETE /knowledge/:id?organization_id=xxx
   * Briše jedan knowledge chunk.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteKnowledge(
    @Param('id') id: string,
    @Query('organization_id') organizationId: string,
  ) {
    if (!organizationId) {
      throw new BadRequestException('organization_id is required');
    }

    const deleted = await this.knowledgeService.deleteKnowledge(id, organizationId);

    if (!deleted) {
      throw new NotFoundException('Knowledge chunk not found');
    }

    return {
      success: true,
      message: 'Knowledge chunk deleted successfully',
    };
  }

  /**
   * POST /knowledge
   * Uploaduje tekst u bazu znanja – seče ga na chunkove i kreira embeddings.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async uploadKnowledge(@Body() dto: CreateKnowledgeDto) {
    const result = await this.knowledgeService.uploadKnowledge(
      dto.organization_id,
      dto.content,
    );

    if (result.savedChunks === 0) {
      throw new BadRequestException(
        'No chunks were saved. Check your content or Supabase connection.',
      );
    }

    return {
      success: true,
      message: `Successfully uploaded ${result.savedChunks} of ${result.totalChunks} chunks.`,
      data: {
        totalChunks: result.totalChunks,
        savedChunks: result.savedChunks,
      },
    };
  }
}
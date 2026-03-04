import { IsString, IsUUID, MinLength } from "class-validator";

export class CreateKnowledgeDto {
    @IsUUID()
    organization_id: string;

    @IsString()
    @MinLength(10)
    content: string;
}
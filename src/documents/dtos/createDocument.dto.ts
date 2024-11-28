import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  filePath: string;

  @IsString()
  @IsNotEmpty()
  fileType: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}

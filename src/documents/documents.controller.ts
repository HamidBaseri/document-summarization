import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Request,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { diskStorage } from 'multer';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          callback(null, fileName);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              'Invalid file type. Only PDF, DOCX, and TXT files are allowed.',
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    const user = req.user;

    if (!file) {
      throw new BadRequestException('File does not uploaded');
    }
    const documentData = {
      userId: user.id,
      fileName: file.originalname,
      filePath: file.path,
      fileType: file.mimetype,
    };

    return this.documentsService.uploadDocument(documentData);
  }

  @Post('batch-upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          callback(null, fileName);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              'Invalid file type. Only PDF, DOCX, and TXT files are allowed.',
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadDocuments(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Request() req: any,
  ) {
    const user = req.user;

    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const uploadedFiles = files.map((file) => ({
      userId: user.id,
      fileName: file.originalname,
      filePath: file.path,
      fileType: file.mimetype,
    }));

    return this.documentsService.uploadMultipleDocuments(uploadedFiles);
  }

  @Get(':id')
  async getDocument(@Param('id') id: string, @Request() req: any) {
    const documentId = parseInt(id, 10);
    const user = req.user;
    return this.documentsService.getDocument(documentId, user.id);
  }

  @Get()
  async getAllDocuments(@Request() req: any) {
    const user = req.user;
    return this.documentsService.getAllDocuments(user.id);
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: string, @Request() req: any) {
    const documentId = parseInt(id, 10);
    const user = req.user;
    return this.documentsService.deleteDocument(documentId, user.id);
  }
}

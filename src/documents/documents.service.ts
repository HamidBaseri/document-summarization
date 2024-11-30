import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadDocument(documentData: {
    userId: number;
    fileName: string;
    filePath: string;
    fileType: string;
  }) {
    const { userId, fileName, filePath, fileType } = documentData;

    return this.prisma.document.create({
      data: {
        userId,
        filename: fileName,
        filePath,
        fileType,
      },
    });
  }

  async uploadMultipleDocuments(
    documentsData: Array<{
      userId: number;
      fileName: string;
      filePath: string;
      fileType: string;
    }>,
  ) {
    const createPromises = documentsData.map((document) =>
      this.prisma.document.create({
        data: {
          userId: document.userId,
          filename: document.fileName,
          filePath: document.filePath,
          fileType: document.fileType,
        },
      }),
    );

    return Promise.all(createPromises);
  }

  async getDocument(id: number, userId: number) {
    const document = await this.prisma.document.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async getAllDocuments(userId: number) {
    return this.prisma.document.findMany({
      where: { userId },
    });
  }

  async deleteDocument(id: number, userId: number) {
    const document = await this.prisma.document.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    await this.prisma.document.delete({
      where: { id },
    });

    return { message: 'Document deleted successfully' };
  }
}

import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { uploadOptions, getLastPathParts } from '../../config/upload.config';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('文件上传')
@Controller('api/upload')
export class UploadController {
  @Public()
  @Post('images/avatar')
  @ApiOperation({ summary: '上传文件' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return {
        code: 500,
        message: '文件上传失败',
        data: null,
      };
    }

    const filepath = getLastPathParts(file.path);
    return {
      code: 200,
      message: '上传成功',
      data: { fileUrl: filepath },
    };
  }
}

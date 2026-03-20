import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { format } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';

const savePath = path.resolve(process.cwd(), 'resource/upload');

interface CategoryConfig {
  folderPath: string;
  allowedTypes: string[];
  maxSize: number;
  keepOriginalName: boolean;
}

const categoryConfigs: CategoryConfig[] = [
  {
    folderPath: '/documents',
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    maxSize: 50,
    keepOriginalName: true,
  },
  {
    folderPath: '/images',
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ],
    maxSize: 10,
    keepOriginalName: false,
  },
  {
    folderPath: '/videos',
    allowedTypes: ['video/mp4', 'video/mpeg', 'video/quicktime'],
    maxSize: 500,
    keepOriginalName: false,
  },
];

export const uploadOptions: MulterOptions = {
  storage: require('multer').diskStorage({
    destination: (req, file, cb) => {
      let saveConfig: CategoryConfig = {
        folderPath: '/common',
        maxSize: 100,
        keepOriginalName: false,
        allowedTypes: [],
      };

      const matchedConfig = categoryConfigs.find((config) =>
        config.allowedTypes.includes(file.mimetype),
      );

      if (matchedConfig) {
        saveConfig = matchedConfig;
      }

      const finishPath = path.join(savePath, saveConfig.folderPath);
      if (!fs.existsSync(finishPath)) {
        fs.mkdirSync(finishPath, { recursive: true });
      }

      cb(null, finishPath);
    },
    filename: (req, file, cb) => {
      const filenameP = format(new Date(), 'yyyyMMddhhmmss');
      const fileName = file.originalname
        .replaceAll(' ', '_')
        .replaceAll('resource', 'common')
        .replace(/[`~!@#$%^&*()|\-=?;:'",<>\{\}\\\/]/gi, '_');

      cb(null, filenameP + fileName);
    },
  }),
  limits: {
    fileSize: 1000 * 1024 * 1024,
  },
};

export const getLastPathParts = (
  filePath: string,
  count: number = 4,
): string => {
  const sep = filePath.includes('\\') ? '\\' : '/';
  const parts = filePath.split(sep).filter((part) => part.trim() !== '');

  if (parts.length <= count) {
    return parts.join('/');
  }

  return parts.slice(-count).join('/');
};

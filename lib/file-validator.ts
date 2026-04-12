export interface FileValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FileConstraints {
  maxSize: number;
  allowedTypes: string[];
  allowedExtensions: string[];
}

const DEFAULT_IMAGE_CONSTRAINTS: FileConstraints = {
  maxSize: 5 * 1024 * 1024,
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
};

const DEFAULT_DOCUMENT_CONSTRAINTS: FileConstraints = {
  maxSize: 10 * 1024 * 1024,
  allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  allowedExtensions: ['.pdf', '.doc', '.docx'],
};

export function validateFile(file: File, constraints: FileConstraints = DEFAULT_IMAGE_CONSTRAINTS): FileValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (file.size > constraints.maxSize) {
    const maxMB = (constraints.maxSize / (1024 * 1024)).toFixed(1);
    errors.push(`Arquivo muito grande. Máximo: ${maxMB}MB`);
  }

  if (!constraints.allowedTypes.includes(file.type)) {
    errors.push(`Tipo de arquivo não permitido: ${file.type}`);
  }

  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!constraints.allowedExtensions.includes(extension)) {
    errors.push(`Extensão não permitida: ${extension}`);
  }

  if (file.name.length > 200) {
    warnings.push('Nome do arquivo muito longo');
  }

  const suspiciousNames = ['<script', 'eval(', 'base64', 'onerror', 'onclick'];
  if (suspiciousNames.some(name => file.name.toLowerCase().includes(name))) {
    errors.push('Nome de arquivo suspeito');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateImage(file: File): FileValidationResult {
  return validateFile(file, DEFAULT_IMAGE_CONSTRAINTS);
}

export function validateDocument(file: File): FileValidationResult {
  return validateFile(file, DEFAULT_DOCUMENT_CONSTRAINTS);
}

export function validateMultipleFiles(files: FileList, maxFiles = 10, constraints: FileConstraints = DEFAULT_IMAGE_CONSTRAINTS): FileValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (files.length > maxFiles) {
    errors.push(`Máximo de ${maxFiles} arquivos permitidos`);
  }

  for (const file of Array.from(files)) {
    const result = validateFile(file, constraints);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  const totalSize = Array.from(files).reduce((acc, file) => acc + file.size, 0);
  if (totalSize > constraints.maxSize * 5) {
    warnings.push('Tamanho total muito grande');
  }

  return {
    valid: errors.length === 0,
    errors: Array.from(new Set(errors)),
    warnings: Array.from(new Set(warnings)),
  };
}

export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊';
  if (mimeType.startsWith('video/')) return '🎬';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) return '📦';
  return '📁';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function isFileSafe(file: File): boolean {
  const result = validateFile(file);
  return result.valid;
}

export function sanitizeFileName(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}
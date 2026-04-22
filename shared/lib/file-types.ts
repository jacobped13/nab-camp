// ==================== IMAGE MIME TYPES ====================
export enum ImageMimeType {
  JPEG = "image/jpeg",
  PNG = "image/png",
  GIF = "image/gif",
  WEBP = "image/webp",
  AVIF = "image/avif",
  SVG = "image/svg+xml",
  BMP = "image/bmp",
  TIFF = "image/tiff",
  ICO = "image/x-icon",
  HEIC = "image/heic",
  HEIF = "image/heif",
}

// ==================== VIDEO MIME TYPES ====================
export enum VideoMimeType {
  MP4 = "video/mp4",
  WEBM = "video/webm",
  OGG = "video/ogg",
  AVI = "video/x-msvideo",
  MOV = "video/quicktime",
  WMV = "video/x-ms-wmv",
  FLV = "video/x-flv",
  MKV = "video/x-matroska",
  THREEGPP = "video/3gpp",
  M4V = "video/x-m4v",
}

// ==================== AUDIO MIME TYPES ====================
export enum AudioMimeType {
  MP3 = "audio/mpeg",
  WAV = "audio/wav",
  OGG = "audio/ogg",
  AAC = "audio/aac",
  FLAC = "audio/flac",
  M4A = "audio/mp4",
  WMA = "audio/x-ms-wma",
  WEBM = "audio/webm",
  OPUS = "audio/opus",
}

// ==================== DOCUMENT MIME TYPES ====================
export enum DocumentMimeType {
  PDF = "application/pdf",
  MSWORD = "application/msword",
  DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  EXCEL = "application/vnd.ms-excel",
  XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  POWERPOINT = "application/vnd.ms-powerpoint",
  PPTX = "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  RTF = "application/rtf",
  ODT = "application/vnd.oasis.opendocument.text",
  ODS = "application/vnd.oasis.opendocument.spreadsheet",
  ODP = "application/vnd.oasis.opendocument.presentation",
}

// ==================== TEXT MIME TYPES ====================
export enum TextMimeType {
  PLAIN = "text/plain",
  JSON = "application/json",
  XML = "text/xml",
  CSV = "text/csv",
  MARKDOWN = "text/markdown",
  YAML = "text/yaml",
}

// ==================== COMBINED MIME TYPE ====================
export type MimeType =
  | ImageMimeType
  | VideoMimeType
  | AudioMimeType
  | DocumentMimeType
  | TextMimeType;

export type MimeTypeKey =
  | keyof typeof ImageMimeType
  | keyof typeof VideoMimeType
  | keyof typeof AudioMimeType
  | keyof typeof DocumentMimeType
  | keyof typeof TextMimeType;

export const MimeType = {
  ...ImageMimeType,
  ...VideoMimeType,
  ...AudioMimeType,
  ...DocumentMimeType,
  ...TextMimeType,
} as const satisfies Record<MimeTypeKey, MimeType>;

// ==================== GROUPED MIME TYPES ====================
export const IMAGES = Object.values(ImageMimeType) as [
  ImageMimeType,
  ...ImageMimeType[]
];
export const VIDEOS = Object.values(VideoMimeType) as [
  VideoMimeType,
  ...VideoMimeType[]
];
export const AUDIO = Object.values(AudioMimeType) as [
  AudioMimeType,
  ...AudioMimeType[]
];
export const DOCUMENTS = Object.values(DocumentMimeType) as [
  DocumentMimeType,
  ...DocumentMimeType[]
];
export const TEXT_FILES = Object.values(TextMimeType) as [
  TextMimeType,
  ...TextMimeType[]
];
export const MIME_TYPES = Object.values(MimeType) as [MimeType, ...MimeType[]];

// ==================== HELPER FUNCTIONS ====================

/**
 * Get file extension from MIME type
 * @returns File extension without dot, or empty string if not found
 */
export const getFileExtension = (mimeType: MimeType): string => {
  const extensions: Record<MimeType, string> = {
    [ImageMimeType.JPEG]: "jpg",
    [ImageMimeType.PNG]: "png",
    [ImageMimeType.GIF]: "gif",
    [ImageMimeType.WEBP]: "webp",
    [ImageMimeType.AVIF]: "avif",
    [ImageMimeType.SVG]: "svg",
    [ImageMimeType.BMP]: "bmp",
    [ImageMimeType.TIFF]: "tiff",
    [ImageMimeType.ICO]: "ico",
    [ImageMimeType.HEIC]: "heic",
    [ImageMimeType.HEIF]: "heif",
    [VideoMimeType.MP4]: "mp4",
    [VideoMimeType.WEBM]: "webm",
    [VideoMimeType.OGG]: "ogv",
    [VideoMimeType.AVI]: "avi",
    [VideoMimeType.MOV]: "mov",
    [VideoMimeType.WMV]: "wmv",
    [VideoMimeType.FLV]: "flv",
    [VideoMimeType.MKV]: "mkv",
    [VideoMimeType.THREEGPP]: "3gp",
    [VideoMimeType.M4V]: "m4v",
    [AudioMimeType.MP3]: "mp3",
    [AudioMimeType.WAV]: "wav",
    [AudioMimeType.OGG]: "ogg",
    [AudioMimeType.AAC]: "aac",
    [AudioMimeType.FLAC]: "flac",
    [AudioMimeType.M4A]: "m4a",
    [AudioMimeType.WMA]: "wma",
    [AudioMimeType.WEBM]: "webm",
    [AudioMimeType.OPUS]: "opus",
    [DocumentMimeType.PDF]: "pdf",
    [DocumentMimeType.MSWORD]: "doc",
    [DocumentMimeType.DOCX]: "docx",
    [DocumentMimeType.EXCEL]: "xls",
    [DocumentMimeType.XLSX]: "xlsx",
    [DocumentMimeType.POWERPOINT]: "ppt",
    [DocumentMimeType.PPTX]: "pptx",
    [DocumentMimeType.RTF]: "rtf",
    [DocumentMimeType.ODT]: "odt",
    [DocumentMimeType.ODS]: "ods",
    [DocumentMimeType.ODP]: "odp",
    [TextMimeType.PLAIN]: "txt",
    [TextMimeType.JSON]: "json",
    [TextMimeType.XML]: "xml",
    [TextMimeType.CSV]: "csv",
    [TextMimeType.MARKDOWN]: "md",
    [TextMimeType.YAML]: "yaml",
  };

  return extensions[mimeType] || "";
};

/**
 * Check if MIME type is an image
 */
export const isImage = (mimeType: MimeType): mimeType is ImageMimeType =>
  Object.values(ImageMimeType).includes(mimeType as ImageMimeType);

/**
 * Check if MIME type is a video
 */
export const isVideo = (mimeType: MimeType): mimeType is VideoMimeType =>
  Object.values(VideoMimeType).includes(mimeType as VideoMimeType);

/**
 * Check if MIME type is audio
 */
export const isAudio = (mimeType: MimeType): mimeType is AudioMimeType =>
  Object.values(AudioMimeType).includes(mimeType as AudioMimeType);

/**
 * Check if MIME type is a document
 */
export const isDocument = (mimeType: MimeType): mimeType is DocumentMimeType =>
  Object.values(DocumentMimeType).includes(mimeType as DocumentMimeType);

/**
 * Check if MIME type is a text file
 */
export const isText = (mimeType: MimeType): mimeType is TextMimeType =>
  Object.values(TextMimeType).includes(mimeType as TextMimeType);

import { EntityAnnotation, TextAnnotation } from '../../common';

// -----------------------------------------------------------------
// Detect File Text
// -----------------------------------------------------------------

export type DetectFileTextInputDto = {
  file: Buffer;
};

export type AnnotationDto = {
  textAnnotations: EntityAnnotation[];
  fullTextAnnotation: TextAnnotation;
};

// -----------------------------------------------------------------
// Detect Remote Image Text
// -----------------------------------------------------------------

export type DetectRemoteImageTextInputDto = {
  imageUri: string;
};

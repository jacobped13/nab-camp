import { useImageWithDimensions } from "@/hooks/use-image-with-dimensions";
import { UploadedDocument } from "@/pages/documents/review/uploaded-document/uploaded-document";

type UploadedDocumentInitializerProps = {
  src: string;
};

export const UploadedDocumentInitializer = ({
  src,
}: UploadedDocumentInitializerProps) => {
  const { loaded, renderImage, scaleBoundingBoxToDisplayed } =
    useImageWithDimensions({ src });

  if (!loaded) return null;

  return (
    <UploadedDocument
      renderImage={renderImage}
      scaleBoundingBoxToDisplayed={scaleBoundingBoxToDisplayed}
    />
  );
};

import {
  type BoundingBox,
  convertCoordinatesToBoundingBox,
} from "@/hooks/use-image-with-dimensions";
import { REVIEW_DATA } from "@/pages/documents/review/consts";

interface ProcessedField extends BoundingBox {
  id: string;
  fieldName: string;
  value: string;
  confidenceScore: number;
}

type UploadedDocumentProps = {
  renderImage: (
    props: React.ImgHTMLAttributes<HTMLImageElement>,
  ) => React.JSX.Element | null;
  scaleBoundingBoxToDisplayed: (naturalBox: BoundingBox) => BoundingBox;
};

export const UploadedDocument = ({
  renderImage,
  scaleBoundingBoxToDisplayed,
}: UploadedDocumentProps) => {
  const processedFields: ProcessedField[] = REVIEW_DATA.map((item) => ({
    id: item.fieldName,
    fieldName: item.fieldName,
    value: item.value,
    confidenceScore: item.confidenceScore,
    ...convertCoordinatesToBoundingBox(item.coordinates),
  }));

  return (
    <div className="relative inline-block">
      {renderImage({
        alt: "W-2 Tax Document",
        style: { display: "block", maxHeight: "80vh" },
      })}

      {/* Overlay container positioned absolutely over the image */}
      <div className="absolute inset-0 pointer-events-none">
        {processedFields.map((field) => {
          const displayedBox = scaleBoundingBoxToDisplayed(field);
          return (
            <div
              key={field.id}
              className="absolute pointer-events-auto bg-blue-200 opacity-40"
              style={{
                left: displayedBox.topLeft.x,
                top: displayedBox.topLeft.y,
                width: displayedBox.topRight.x - displayedBox.topLeft.x,
                height: displayedBox.bottomLeft.y - displayedBox.topLeft.y,
              }}
              title={`${field.fieldName}: ${field.value} (${Math.round(field.confidenceScore * 100)}%)`}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

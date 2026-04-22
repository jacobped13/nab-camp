import { useState, useEffect, useRef } from "react";
import { useCallback } from "react";

export type Dimensions = {
  width: number;
  height: number;
};

export type Point = {
  x: number;
  y: number;
};

export type BoundingBox = {
  topLeft: Point;
  topRight: Point;
  bottomLeft: Point;
  bottomRight: Point;
};

export type RectangleCoordinates = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ScaleRatio = {
  x: number;
  y: number;
};

type UseImageWithDimensionsArgs = {
  src: string;
};

export const convertCoordinatesToBoundingBox = (
  coords: [
    [number, number],
    [number, number],
    [number, number],
    [number, number],
  ],
): BoundingBox => {
  return {
    topLeft: { x: coords[0][0], y: coords[0][1] },
    topRight: { x: coords[1][0], y: coords[1][1] },
    bottomRight: { x: coords[2][0], y: coords[2][1] },
    bottomLeft: { x: coords[3][0], y: coords[3][1] },
  };
};

export const boundingBoxToRectangle = (
  box: BoundingBox,
): RectangleCoordinates => {
  const minX = Math.min(
    box.topLeft.x,
    box.topRight.x,
    box.bottomLeft.x,
    box.bottomRight.x,
  );
  const maxX = Math.max(
    box.topLeft.x,
    box.topRight.x,
    box.bottomLeft.x,
    box.bottomRight.x,
  );
  const minY = Math.min(
    box.topLeft.y,
    box.topRight.y,
    box.bottomLeft.y,
    box.bottomRight.y,
  );
  const maxY = Math.max(
    box.topLeft.y,
    box.topRight.y,
    box.bottomLeft.y,
    box.bottomRight.y,
  );

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

export const rectangleToBoundingBox = (
  rect: RectangleCoordinates,
): BoundingBox => {
  return {
    topLeft: { x: rect.x, y: rect.y },
    topRight: { x: rect.x + rect.width, y: rect.y },
    bottomLeft: { x: rect.x, y: rect.y + rect.height },
    bottomRight: { x: rect.x + rect.width, y: rect.y + rect.height },
  };
};

export const useImageWithDimensions = ({ src }: UseImageWithDimensionsArgs) => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });
  const [loaded, setLoaded] = useState<boolean>(false);
  const [displayedDimensions, setDisplayedDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!src) return;

    const img = new Image();

    img.addEventListener("load", () => {
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      setLoaded(true);
    });

    img.addEventListener("error", () => {
      console.error("Failed to load image:", src);
      setLoaded(true);
    });

    img.src = src;
  }, [src]);

  useEffect(() => {
    if (!imgRef.current || !loaded) return;

    const updateDisplayedDimensions = () => {
      if (!imgRef.current) return;

      setDisplayedDimensions({
        width: imgRef.current.offsetWidth,
        height: imgRef.current.offsetHeight,
      });
    };

    updateDisplayedDimensions();

    const resizeObserver = new ResizeObserver(updateDisplayedDimensions);
    resizeObserver.observe(imgRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [loaded]);

  const getDisplayedDimensions = useCallback((): Dimensions => {
    return displayedDimensions;
  }, [displayedDimensions]);

  const getNaturalDimensions = useCallback((): Dimensions => {
    return dimensions;
  }, [dimensions]);

  const getScaleRatio = useCallback((): ScaleRatio => {
    const displayed = getDisplayedDimensions();
    if (
      !displayed.width ||
      !displayed.height ||
      !dimensions.width ||
      !dimensions.height
    ) {
      return { x: 1, y: 1 };
    }

    const xRatio = displayed.width / dimensions.width;
    const yRatio = displayed.height / dimensions.height;

    const uniformRatio = Math.min(xRatio, yRatio);

    return {
      x: uniformRatio,
      y: uniformRatio,
    };
  }, [getDisplayedDimensions, dimensions.width, dimensions.height]);

  const scaleBoundingBoxToDisplayed = useCallback(
    (naturalBox: BoundingBox): BoundingBox => {
      const ratio = getScaleRatio();
      return {
        topLeft: {
          x: naturalBox.topLeft.x * ratio.x,
          y: naturalBox.topLeft.y * ratio.y,
        },
        topRight: {
          x: naturalBox.topRight.x * ratio.x,
          y: naturalBox.topRight.y * ratio.y,
        },
        bottomLeft: {
          x: naturalBox.bottomLeft.x * ratio.x,
          y: naturalBox.bottomLeft.y * ratio.y,
        },
        bottomRight: {
          x: naturalBox.bottomRight.x * ratio.x,
          y: naturalBox.bottomRight.y * ratio.y,
        },
      };
    },
    [getScaleRatio],
  );

  const renderImage = useCallback(
    (
      props: React.ImgHTMLAttributes<HTMLImageElement>,
    ): React.JSX.Element | null => {
      if (!loaded) return null;

      return <img ref={imgRef} src={src} alt="" {...props} />;
    },
    [loaded, src],
  );

  return {
    loaded,
    renderImage,
    scaleBoundingBoxToDisplayed,
    getNaturalDimensions,
    getDisplayedDimensions,
    getScaleRatio,
  } as const;
};

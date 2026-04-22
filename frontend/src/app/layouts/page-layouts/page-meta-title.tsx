import { useEffect } from "react";

import { PRODUCT_NAME } from "@/lib/consts/products";

type PageMetaTitleProps = {
  title: string;
};

export const PageMetaTitle = ({ title }: PageMetaTitleProps) => {
  useEffect(() => {
    document.title = `${title} - ${PRODUCT_NAME}`;
  }, [title]);

  return null;
};

import { type RefObject, useEffect } from "react";

type useIntersectionObserverArgs = {
  ref: RefObject<HTMLDivElement | null>;
  callback: () => void;
  options?: IntersectionObserverInit;
};

export const useIntersectionObserver = ({
  ref,
  callback,
  options = {},
}: useIntersectionObserverArgs): void => {
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
        }
      },
      {
        threshold: 0.1,
        ...options,
      },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, callback, options]);
};

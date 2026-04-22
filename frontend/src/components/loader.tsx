import { Loader2 } from "lucide-react";

export const AppLoader = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader2 className="h-5 w-5 mr-2 animate-spin text-muted-foreground" />
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="h-5 w-5 mr-2 animate-spin text-muted-foreground" />
    </div>
  );
};

export const PageLoaderWithOverlay = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background z-50">
      <Loader2 className="h-5 w-5 mr-2 animate-spin text-muted-foreground" />
    </div>
  );
};

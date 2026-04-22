import { Slot } from "@radix-ui/react-slot";
import {
  isAudio,
  isDocument,
  isImage,
  isText,
  isVideo,
  type MimeType,
} from "@shared/lib/file-types";
import { formatBytes } from "@shared/lib/size";
import { TIMING } from "@shared/lib/timing";
import { omit } from "lodash-es";
import {
  FileAudioIcon,
  FileIcon,
  FileImageIcon,
  FileTextIcon,
  FileVideoIcon,
  Upload,
  X,
} from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  createContext,
  useRef,
  type RefObject,
  useContext,
  useId,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  Fragment,
  type DragEvent,
  type ChangeEvent,
  type KeyboardEvent,
  useState,
  useSyncExternalStore,
} from "react";
import { toast } from "sonner";

import { Button } from "@/components/button";
import { cn } from "@/lib/utils/classname";

const ROOT_NAME = "FileUpload";
const DROPZONE_NAME = "FileUploadDropzone";
const TRIGGER_NAME = "FileUploadTrigger";
const LIST_NAME = "FileUploadList";
const ITEM_NAME = "FileUploadItem";
const ITEM_PREVIEW_NAME = "FileUploadItemPreview";
const ITEM_METADATA_NAME = "FileUploadItemMetadata";
const ITEM_PROGRESS_NAME = "FileUploadItemProgress";
const ITEM_DELETE_NAME = "FileUploadItemDelete";
const CLEAR_NAME = "FileUploadClear";

const FILE_UPLOAD_ERRORS = {
  [ROOT_NAME]: `\`${ROOT_NAME}\` must be used as root component`,
  [DROPZONE_NAME]: `\`${DROPZONE_NAME}\` must be within \`${ROOT_NAME}\``,
  [TRIGGER_NAME]: `\`${TRIGGER_NAME}\` must be within \`${ROOT_NAME}\``,
  [LIST_NAME]: `\`${LIST_NAME}\` must be within \`${ROOT_NAME}\``,
  [ITEM_NAME]: `\`${ITEM_NAME}\` must be within \`${ROOT_NAME}\``,
  [ITEM_PREVIEW_NAME]: `\`${ITEM_PREVIEW_NAME}\` must be within \`${ITEM_NAME}\``,
  [ITEM_METADATA_NAME]: `\`${ITEM_METADATA_NAME}\` must be within \`${ITEM_NAME}\``,
  [ITEM_PROGRESS_NAME]: `\`${ITEM_PROGRESS_NAME}\` must be within \`${ITEM_NAME}\``,
  [ITEM_DELETE_NAME]: `\`${ITEM_DELETE_NAME}\` must be within \`${ITEM_NAME}\``,
  [CLEAR_NAME]: `\`${CLEAR_NAME}\` must be within \`${ROOT_NAME}\``,
} as const;

function useAsRef<T>(data: T) {
  const ref = useRef<T>(data);
  useEffect(() => {
    ref.current = data;
  });
  return ref;
}

function useLazyRef<T>(fn: () => T) {
  const ref = useRef<T | null>(null);
  if (ref.current === null) {
    ref.current = fn();
  }
  return ref as RefObject<T>;
}

type Direction = "ltr" | "rtl";

const DirectionContext = createContext<Direction | undefined>(undefined);

function useDirection(dirProp?: Direction): Direction {
  const contextDir = useContext(DirectionContext);
  return dirProp ?? contextDir ?? "ltr";
}

interface FileState {
  file: File;
  progress: number;
  error?: string;
  status: "idle" | "uploading" | "error" | "success";
}

interface StoreState {
  files: Map<File, FileState>;
  dragOver: boolean;
  invalid: boolean;
}

type StoreAction =
  | { variant: "ADD_FILES"; files: File[] }
  | { variant: "SET_FILES"; files: File[] }
  | { variant: "SET_PROGRESS"; file: File; progress: number }
  | { variant: "SET_SUCCESS"; file: File }
  | { variant: "SET_ERROR"; file: File; error: string }
  | { variant: "REMOVE_FILE"; file: File }
  | { variant: "SET_DRAG_OVER"; dragOver: boolean }
  | { variant: "SET_INVALID"; invalid: boolean }
  | { variant: "CLEAR" };

function createStore(
  listeners: Set<() => void>,
  files: Map<File, FileState>,
  onValueChange?: (files: File[]) => void,
  invalid?: boolean,
) {
  const initialState: StoreState = {
    files,
    dragOver: false,
    invalid: invalid ?? false,
  };

  let state = initialState;

  function handleAddFiles(filesToAdd: File[]) {
    for (const file of filesToAdd) {
      files.set(file, {
        file,
        progress: 0,
        status: "idle",
      });
    }

    if (onValueChange) {
      const fileList = [...files.values()].map((fileState) => fileState.file);
      onValueChange(fileList);
    }
  }

  function handleSetFiles(filesToSet: File[]) {
    const newFileSet = new Set(filesToSet);
    for (const existingFile of files.keys()) {
      if (!newFileSet.has(existingFile)) {
        files.delete(existingFile);
      }
    }

    for (const file of filesToSet) {
      if (!files.has(file)) {
        files.set(file, {
          file,
          progress: 0,
          status: "idle",
        });
      }
    }
  }

  function reducer(state: StoreState, action: StoreAction): StoreState {
    switch (action.variant) {
      case "ADD_FILES": {
        handleAddFiles(action.files);
        return { ...state, files };
      }

      case "SET_FILES": {
        handleSetFiles(action.files);
        return { ...state, files };
      }

      case "SET_PROGRESS": {
        const fileState = files.get(action.file);
        if (fileState) {
          files.set(action.file, {
            ...fileState,
            progress: action.progress,
            status: "uploading",
          });
        }
        return { ...state, files };
      }

      case "SET_SUCCESS": {
        const fileState = files.get(action.file);
        if (fileState) {
          files.set(action.file, {
            ...fileState,
            progress: 100,
            status: "success",
          });
        }
        return { ...state, files };
      }

      case "SET_ERROR": {
        const fileState = files.get(action.file);
        if (fileState) {
          files.set(action.file, {
            ...fileState,
            error: action.error,
            status: "error",
          });
        }
        return { ...state, files };
      }

      case "REMOVE_FILE": {
        files.delete(action.file);

        if (onValueChange) {
          const fileList = [...files.values()].map(
            (fileState) => fileState.file,
          );
          onValueChange(fileList);
        }
        return { ...state, files };
      }

      case "SET_DRAG_OVER": {
        return { ...state, dragOver: action.dragOver };
      }

      case "SET_INVALID": {
        return { ...state, invalid: action.invalid };
      }

      case "CLEAR": {
        files.clear();
        if (onValueChange) {
          onValueChange([]);
        }
        return { ...state, files, invalid: false };
      }

      default: {
        return state;
      }
    }
  }

  function getState() {
    return state;
  }

  function dispatch(action: StoreAction) {
    state = reducer(state, action);
    for (const listener of listeners) {
      listener();
    }
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { getState, dispatch, subscribe };
}

const StoreContext = createContext<ReturnType<typeof createStore> | null>(null);
StoreContext.displayName = ROOT_NAME;

function useStoreContext(name: keyof typeof FILE_UPLOAD_ERRORS) {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error(FILE_UPLOAD_ERRORS[name]);
  }
  return context;
}

function useStore<T>(selector: (state: StoreState) => T): T {
  const store = useStoreContext(ROOT_NAME);

  const lastValueRef = useLazyRef<{ value: T; state: StoreState } | null>(
    () => null,
  );

  const getSnapshot = useCallback(() => {
    const state = store.getState();
    const prevValue = lastValueRef.current;

    if (prevValue && prevValue.state === state) {
      return prevValue.value;
    }

    const nextValue = selector(state);
    lastValueRef.current = { value: nextValue, state };
    return nextValue;
  }, [store, selector, lastValueRef]);

  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

interface FileUploadContextValue {
  inputId: string;
  dropzoneId: string;
  listId: string;
  labelId: string;
  disabled: boolean;
  dir: Direction;
  inputRef: RefObject<HTMLInputElement | null>;
}

const FileUploadContext = createContext<FileUploadContextValue | null>(null);

function useFileUploadContext(name: keyof typeof FILE_UPLOAD_ERRORS) {
  const context = useContext(FileUploadContext);
  if (!context) {
    throw new Error(FILE_UPLOAD_ERRORS[name]);
  }
  return context;
}

interface FileUploadRootProps
  extends Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange"> {
  value?: File[];
  defaultValue?: File[];
  onValueChange?: (files: File[]) => void;
  onAccept?: (files: File[]) => void;
  onFileAccept?: (file: File) => void;
  onFileReject?: (file: File, message: string) => void;
  onFileValidate?: (file: File) => string | null | undefined;
  onUpload?: (
    files: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    },
  ) => Promise<void> | void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  dir?: Direction;
  label?: string;
  name?: string;
  asChild?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  multiple?: boolean;
  required?: boolean;
}

const FileUploadRoot = forwardRef<HTMLDivElement, FileUploadRootProps>(
  (props, forwardedRef) => {
    const {
      value,
      defaultValue,
      onValueChange,
      accept,
      dir: dirProp,
      label,
      name,
      asChild,
      disabled = false,
      invalid = false,
      multiple = false,
      required = false,
      children,
      className,
      ...rootProps
    } = props;

    const inputId = useId();
    const dropzoneId = useId();
    const listId = useId();
    const labelId = useId();

    const dir = useDirection(dirProp);
    const propsRef = useAsRef(props);
    const listeners = useLazyRef(() => new Set<() => void>()).current;
    const files = useLazyRef<Map<File, FileState>>(() => new Map()).current;
    const inputRef = useRef<HTMLInputElement>(null);
    const isControlled = value !== undefined;

    const store = useMemo(
      () => createStore(listeners, files, onValueChange, invalid),
      [listeners, files, onValueChange, invalid],
    );

    const contextValue = useMemo<FileUploadContextValue>(
      () => ({
        dropzoneId,
        inputId,
        listId,
        labelId,
        dir,
        disabled,
        inputRef,
      }),
      [dropzoneId, inputId, listId, labelId, dir, disabled],
    );

    useEffect(() => {
      if (isControlled) {
        store.dispatch({ variant: "SET_FILES", files: value });
      } else if (
        defaultValue &&
        defaultValue.length > 0 &&
        store.getState().files.size === 0
      ) {
        store.dispatch({ variant: "SET_FILES", files: defaultValue });
      }
    }, [value, defaultValue, isControlled, store]);

    const onFilesUpload = useCallback(
      async (files: File[]) => {
        try {
          for (const file of files) {
            store.dispatch({ variant: "SET_PROGRESS", file, progress: 0 });
          }

          if (propsRef.current.onUpload) {
            await propsRef.current.onUpload(files, {
              onProgress: (file, progress) => {
                store.dispatch({
                  variant: "SET_PROGRESS",
                  file,
                  progress: Math.min(Math.max(0, progress), 100),
                });
              },
              onSuccess: (file) => {
                store.dispatch({ variant: "SET_SUCCESS", file });
              },
              onError: (file, error) => {
                store.dispatch({
                  variant: "SET_ERROR",
                  file,
                  error: error.message ?? "Upload failed",
                });
              },
            });
          } else {
            for (const file of files) {
              store.dispatch({ variant: "SET_SUCCESS", file });
            }
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Upload failed";
          for (const file of files) {
            store.dispatch({
              variant: "SET_ERROR",
              file,
              error: errorMessage,
            });
          }
        }
      },
      [store, propsRef],
    );

    const validateFileType = useCallback(
      (file: File): { rejected: boolean; message: string } => {
        if (!propsRef.current.accept) return { rejected: false, message: "" };

        const acceptTypes = propsRef.current.accept
          .split(",")
          .map((t) => t.trim());
        const fileType = file.type;
        const fileExtension = `.${file.name.split(".").pop()}`;

        const isAccepted = acceptTypes.some(
          (type) =>
            type === fileType ||
            type === fileExtension ||
            (type.includes("/*") &&
              fileType.startsWith(type.replace("/*", "/"))),
        );

        if (!isAccepted) {
          return { rejected: true, message: "File type not accepted" };
        }

        return { rejected: false, message: "" };
      },
      [propsRef],
    );

    const validateFile = useCallback(
      (file: File): { rejected: boolean; message: string } => {
        if (propsRef.current.onFileValidate) {
          const validationMessage = propsRef.current.onFileValidate(file);
          if (validationMessage) {
            return { rejected: true, message: validationMessage };
          }
        }

        const typeValidation = validateFileType(file);
        if (typeValidation.rejected) return typeValidation;

        if (propsRef.current.maxSize && file.size > propsRef.current.maxSize) {
          return { rejected: true, message: "File too large" };
        }

        return { rejected: false, message: "" };
      },
      [propsRef, validateFileType],
    );

    const enforceMaxFiles = useCallback(
      (files: File[]): { filesToProcess: File[]; invalid: boolean } => {
        if (!propsRef.current.maxFiles) {
          return { filesToProcess: files, invalid: false };
        }

        const currentCount = store.getState().files.size;
        const remainingSlotCount = Math.max(
          0,
          propsRef.current.maxFiles - currentCount,
        );

        if (remainingSlotCount >= files.length) {
          return { filesToProcess: files, invalid: false };
        }

        const rejectedFiles = files.slice(remainingSlotCount);
        for (const file of rejectedFiles) {
          const { message } = validateFile(file);
          const rejectionMessage =
            message || `Maximum ${propsRef.current.maxFiles} files allowed`;
          propsRef.current.onFileReject?.(file, rejectionMessage);
        }

        return {
          filesToProcess: files.slice(0, remainingSlotCount),
          invalid: true,
        };
      },
      [propsRef, store, validateFile],
    );

    const partitionFiles = useCallback(
      (files: File[]): { acceptedFiles: File[]; hasRejections: boolean } => {
        const acceptedFiles: File[] = [];
        let hasRejections = false;

        for (const file of files) {
          const { rejected, message } = validateFile(file);

          if (rejected) {
            propsRef.current.onFileReject?.(file, message);
            hasRejections = true;
          } else {
            acceptedFiles.push(file);
          }
        }

        return { acceptedFiles, hasRejections };
      },
      [propsRef, validateFile],
    );

    const onFilesChange = useCallback(
      (originalFiles: File[]) => {
        if (propsRef.current.disabled) return;

        const { filesToProcess, invalid: maxFilesExceeded } = enforceMaxFiles([
          ...originalFiles,
        ]);
        const { acceptedFiles, hasRejections } = partitionFiles(filesToProcess);

        const invalid = maxFilesExceeded || hasRejections;

        if (invalid) {
          store.dispatch({ variant: "SET_INVALID", invalid });
          setTimeout(() => {
            store.dispatch({ variant: "SET_INVALID", invalid: false });
          }, TIMING.SECOND.IN_MILLISECONDS * 2);
        }

        if (acceptedFiles.length > 0) {
          store.dispatch({ variant: "ADD_FILES", files: acceptedFiles });

          if (isControlled && propsRef.current.onValueChange) {
            const currentFiles = [...store.getState().files.values()].map(
              (f) => f.file,
            );
            propsRef.current.onValueChange([...currentFiles]);
          }

          propsRef.current.onAccept?.(acceptedFiles);

          for (const file of acceptedFiles) {
            propsRef.current.onFileAccept?.(file);
          }

          if (propsRef.current.onUpload) {
            requestAnimationFrame(() => {
              onFilesUpload(acceptedFiles);
            });
          }
        }
      },
      [
        store,
        isControlled,
        onFilesUpload,
        propsRef,
        enforceMaxFiles,
        partitionFiles,
      ],
    );

    const onInputChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        onFilesChange(files);
        event.target.value = "";
      },
      [onFilesChange],
    );

    const RootPrimitive = asChild ? Slot : "div";

    return (
      <DirectionContext.Provider value={dir}>
        <StoreContext.Provider value={store}>
          <FileUploadContext.Provider value={contextValue}>
            <RootPrimitive
              data-disabled={disabled ? "" : undefined}
              data-slot="file-upload"
              dir={dir}
              {...omit(rootProps, ["maxFiles", "maxSize", "onFileReject"])}
              ref={forwardedRef}
              className={cn("relative flex flex-col gap-2", className)}
            >
              {children}
              <input
                type="file"
                id={inputId}
                aria-labelledby={labelId}
                aria-describedby={dropzoneId}
                ref={inputRef}
                tabIndex={-1}
                accept={accept}
                name={name}
                disabled={disabled}
                multiple={multiple}
                required={required}
                className="sr-only"
                onChange={onInputChange}
              />
              <span id={labelId} className="sr-only">
                {label ?? "File upload"}
              </span>
            </RootPrimitive>
          </FileUploadContext.Provider>
        </StoreContext.Provider>
      </DirectionContext.Provider>
    );
  },
);
FileUploadRoot.displayName = ROOT_NAME;

interface FileUploadDropzoneProps extends ComponentPropsWithoutRef<"div"> {
  asChild?: boolean;
}

const FileUploadDropzone = forwardRef<HTMLDivElement, FileUploadDropzoneProps>(
  (props, forwardedRef) => {
    const { asChild, className, ...dropzoneProps } = props;

    const context = useFileUploadContext(DROPZONE_NAME);
    const store = useStoreContext(DROPZONE_NAME);
    const dragOver = useStore((state) => state.dragOver);
    const invalid = useStore((state) => state.invalid);
    const propsRef = useAsRef(dropzoneProps);

    const onClick = useCallback(
      (event: MouseEvent<HTMLDivElement>) => {
        propsRef.current?.onClick?.(event);

        if (event.defaultPrevented) return;

        const target = event.target;

        const isFromTrigger =
          target instanceof HTMLElement &&
          target.closest('[data-slot="file-upload-trigger"]');

        if (!isFromTrigger) {
          context.inputRef.current?.click();
        }
      },
      [context.inputRef, propsRef],
    );

    const onDragOver = useCallback(
      (event: DragEvent<HTMLDivElement>) => {
        propsRef.current?.onDragOver?.(event);

        if (event.defaultPrevented) return;

        event.preventDefault();
        store.dispatch({ variant: "SET_DRAG_OVER", dragOver: true });
      },
      [store, propsRef],
    );

    const onDragEnter = useCallback(
      (event: DragEvent<HTMLDivElement>) => {
        propsRef.current?.onDragEnter?.(event);

        if (event.defaultPrevented) return;

        event.preventDefault();
        store.dispatch({ variant: "SET_DRAG_OVER", dragOver: true });
      },
      [store, propsRef],
    );

    const onDragLeave = useCallback(
      (event: DragEvent<HTMLDivElement>) => {
        propsRef.current?.onDragLeave?.(event);

        if (event.defaultPrevented) return;

        event.preventDefault();
        store.dispatch({ variant: "SET_DRAG_OVER", dragOver: false });
      },
      [store, propsRef],
    );

    const onDrop = useCallback(
      (event: DragEvent<HTMLDivElement>) => {
        propsRef.current?.onDrop?.(event);

        if (event.defaultPrevented) return;

        event.preventDefault();
        store.dispatch({ variant: "SET_DRAG_OVER", dragOver: false });

        const files = Array.from(event.dataTransfer.files);
        const inputElement = context.inputRef.current;
        if (!inputElement) return;

        const dataTransfer = new DataTransfer();
        for (const file of files) {
          dataTransfer.items.add(file);
        }

        inputElement.files = dataTransfer.files;
        inputElement.dispatchEvent(new Event("change", { bubbles: true }));
      },
      [store, context.inputRef, propsRef],
    );

    const onKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        propsRef.current?.onKeyDown?.(event);

        if (
          !event.defaultPrevented &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          context.inputRef.current?.click();
        }
      },
      [context.inputRef, propsRef],
    );

    const DropzonePrimitive = asChild ? Slot : "div";

    return (
      <DropzonePrimitive
        id={context.dropzoneId}
        aria-controls={`${context.inputId} ${context.listId}`}
        data-disabled={context.disabled ? "" : undefined}
        data-dragging={dragOver ? "" : undefined}
        data-invalid={invalid ? "" : undefined}
        data-slot="file-upload-dropzone"
        dir={context.dir}
        {...dropzoneProps}
        ref={forwardedRef}
        tabIndex={context.disabled ? undefined : 0}
        className={cn(
          "relative flex select-none flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 outline-none transition-colors hover:bg-accent/30 focus-visible:border-ring/50 data-[disabled]:pointer-events-none data-[dragging]:border-primary data-[invalid]:border-destructive data-[invalid]:ring-destructive/20",
          className,
        )}
        onClick={onClick}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onKeyDown={onKeyDown}
      />
    );
  },
);
FileUploadDropzone.displayName = DROPZONE_NAME;

interface FileUploadTriggerProps extends ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
}

const FileUploadTrigger = forwardRef<HTMLButtonElement, FileUploadTriggerProps>(
  (props, forwardedRef) => {
    const { asChild, ...triggerProps } = props;
    const context = useFileUploadContext(TRIGGER_NAME);
    const propsRef = useAsRef(triggerProps);

    const onClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        propsRef.current?.onClick?.(event);

        if (event.defaultPrevented) return;

        context.inputRef.current?.click();
      },
      [context.inputRef, propsRef],
    );

    const TriggerPrimitive = asChild ? Slot : "button";

    return (
      <TriggerPrimitive
        type="button"
        aria-controls={context.inputId}
        data-disabled={context.disabled ? "" : undefined}
        data-slot="file-upload-trigger"
        {...triggerProps}
        ref={forwardedRef}
        disabled={context.disabled}
        onClick={onClick}
      />
    );
  },
);
FileUploadTrigger.displayName = TRIGGER_NAME;

interface FileUploadListProps extends ComponentPropsWithoutRef<"div"> {
  orientation?: "horizontal" | "vertical";
  asChild?: boolean;
  forceMount?: boolean;
}

const FileUploadList = forwardRef<HTMLDivElement, FileUploadListProps>(
  (props, forwardedRef) => {
    const {
      className,
      orientation = "vertical",
      asChild,
      forceMount,
      ...listProps
    } = props;

    const context = useFileUploadContext(LIST_NAME);

    const state = useStore((state) => state.files.size > 0);

    const shouldRender = forceMount || state;

    if (!shouldRender) return null;

    const ListPrimitive = asChild ? Slot : "div";

    return (
      <ListPrimitive
        role="list"
        id={context.listId}
        data-orientation={orientation}
        data-slot="file-upload-list"
        data-state={shouldRender ? "active" : "inactive"}
        dir={context.dir}
        {...listProps}
        ref={forwardedRef}
        className={cn(
          "data-[state=inactive]:fade-out-0 data-[state=active]:fade-in-0 data-[state=inactive]:slide-out-to-top-2 data-[state=active]:slide-in-from-top-2 flex flex-col gap-2 data-[state=active]:animate-in data-[state=inactive]:animate-out",
          orientation === "horizontal" && "flex-row overflow-x-auto p-1.5",
          className,
        )}
      />
    );
  },
);
FileUploadList.displayName = LIST_NAME;

interface FileUploadItemContextValue {
  id: string;
  fileState: FileState | undefined;
  nameId: string;
  sizeId: string;
  statusId: string;
  messageId: string;
}

const FileUploadItemContext = createContext<FileUploadItemContextValue | null>(
  null,
);

function useFileUploadItemContext(name: keyof typeof FILE_UPLOAD_ERRORS) {
  const context = useContext(FileUploadItemContext);
  if (!context) {
    throw new Error(FILE_UPLOAD_ERRORS[name]);
  }
  return context;
}

interface FileUploadItemProps extends ComponentPropsWithoutRef<"div"> {
  value: File;
  asChild?: boolean;
}

const FileUploadItem = forwardRef<HTMLDivElement, FileUploadItemProps>(
  (props, forwardedRef) => {
    const { value, asChild, className, ...itemProps } = props;

    const id = useId();
    const statusId = `${id}-status`;
    const nameId = `${id}-name`;
    const sizeId = `${id}-size`;
    const messageId = `${id}-message`;

    const context = useFileUploadContext(ITEM_NAME);
    const fileState = useStore((state) => state.files.get(value));
    const fileCount = useStore((state) => state.files.size);
    const fileIndex = useStore((state) => {
      const files = [...state.files.keys()];
      return files.indexOf(value) + 1;
    });

    const itemContext = useMemo(
      () => ({
        id,
        fileState,
        nameId,
        sizeId,
        statusId,
        messageId,
      }),
      [id, fileState, statusId, nameId, sizeId, messageId],
    );

    if (!fileState) return null;

    const statusText = (() => {
      if (fileState.error) return `Error: ${fileState.error}`;
      if (fileState.status === "uploading") {
        return `Uploading: ${fileState.progress}% complete`;
      }
      if (fileState.status === "success") return "Upload complete";
      return "Ready to upload";
    })();

    const ItemPrimitive = asChild ? Slot : "div";

    return (
      <FileUploadItemContext.Provider value={itemContext}>
        <ItemPrimitive
          role="listitem"
          id={id}
          aria-setsize={fileCount}
          aria-posinset={fileIndex}
          aria-describedby={`${nameId} ${sizeId} ${statusId} ${
            fileState.error ? messageId : ""
          }`}
          aria-labelledby={nameId}
          data-slot="file-upload-item"
          dir={context.dir}
          {...itemProps}
          ref={forwardedRef}
          className={cn(
            "relative flex items-center gap-2.5 rounded-md border p-3 has-[_[data-slot=file-upload-progress]]:flex-col has-[_[data-slot=file-upload-progress]]:items-start",
            className,
          )}
        >
          {props.children}
          <span id={statusId} className="sr-only">
            {statusText}
          </span>
        </ItemPrimitive>
      </FileUploadItemContext.Provider>
    );
  },
);
FileUploadItem.displayName = ITEM_NAME;

function getFileIcon(file: File): ReactElement {
  const type = file.type as MimeType;

  if (isImage(type)) {
    return <FileImageIcon />;
  }

  if (isVideo(type)) {
    return <FileVideoIcon />;
  }

  if (isAudio(type)) {
    return <FileAudioIcon />;
  }

  if (isDocument(type) || isText(type)) {
    return <FileTextIcon />;
  }

  return <FileIcon />;
}

interface FileUploadItemPreviewProps extends ComponentPropsWithoutRef<"div"> {
  render?: (file: File) => ReactNode;
  asChild?: boolean;
}

const FileUploadItemPreview = forwardRef<
  HTMLDivElement,
  FileUploadItemPreviewProps
>((props, forwardedRef): ReactElement | null => {
  const { render, asChild, children, className, ...previewProps } = props;

  const itemContext = useFileUploadItemContext(ITEM_PREVIEW_NAME);

  const isImage = itemContext.fileState?.file.type.startsWith("image/");

  const onPreviewRender = useCallback(
    (file: File): ReactElement => {
      if (render) return <>{render(file)}</>;

      return getFileIcon(file);
    },
    [render],
  );

  if (!itemContext.fileState) return <Fragment />;

  const ItemPreviewPrimitive = asChild ? Slot : "div";

  return (
    <ItemPreviewPrimitive
      aria-labelledby={itemContext.nameId}
      data-slot="file-upload-preview"
      {...previewProps}
      ref={forwardedRef}
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center rounded-md",
        isImage ? "object-cover" : "bg-accent/50 [&>svg]:size-7",
        className,
      )}
    >
      {onPreviewRender(itemContext.fileState.file)}
      {children}
    </ItemPreviewPrimitive>
  );
});
FileUploadItemPreview.displayName = ITEM_PREVIEW_NAME;

interface FileUploadItemMetadataProps extends ComponentPropsWithoutRef<"div"> {
  asChild?: boolean;
}

const FileUploadItemMetadata = forwardRef<
  HTMLDivElement,
  FileUploadItemMetadataProps
>((props, forwardedRef) => {
  const { asChild, children, className, ...metadataProps } = props;

  const context = useFileUploadContext(ITEM_METADATA_NAME);
  const itemContext = useFileUploadItemContext(ITEM_METADATA_NAME);

  if (!itemContext.fileState) return null;

  const ItemMetadataPrimitive = asChild ? Slot : "div";

  return (
    <ItemMetadataPrimitive
      data-slot="file-upload-metadata"
      dir={context.dir}
      {...metadataProps}
      ref={forwardedRef}
      className={cn("flex min-w-0 flex-1 flex-col", className)}
    >
      {children ?? (
        <>
          <span
            id={itemContext.nameId}
            className="truncate font-medium text-sm"
          >
            {itemContext.fileState.file.name}
          </span>
          <span
            id={itemContext.sizeId}
            className="text-muted-foreground text-xs"
          >
            {formatBytes({ bytes: itemContext.fileState.file.size })}
          </span>
          {itemContext.fileState.error && (
            <span
              id={itemContext.messageId}
              className="text-destructive text-xs"
            >
              {itemContext.fileState.error}
            </span>
          )}
        </>
      )}
    </ItemMetadataPrimitive>
  );
});
FileUploadItemMetadata.displayName = ITEM_METADATA_NAME;

interface FileUploadItemProgressProps extends ComponentPropsWithoutRef<"div"> {
  asChild?: boolean;
  circular?: boolean;
  size?: number;
}

const FileUploadItemProgress = forwardRef<
  HTMLDivElement,
  FileUploadItemProgressProps
>((props, forwardedRef) => {
  const { circular, size = 40, asChild, className, ...progressProps } = props;

  const itemContext = useFileUploadItemContext(ITEM_PROGRESS_NAME);

  if (!itemContext.fileState) return null;

  const ItemProgressPrimitive = asChild ? Slot : "div";

  if (circular) {
    if (itemContext.fileState.status === "success") return null;

    const circumference = 2 * Math.PI * ((size - 4) / 2);
    const strokeDashoffset =
      circumference - (itemContext.fileState.progress / 100) * circumference;

    return (
      <ItemProgressPrimitive
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={itemContext.fileState.progress}
        aria-valuetext={`${itemContext.fileState.progress}%`}
        aria-labelledby={itemContext.nameId}
        data-slot="file-upload-progress"
        {...progressProps}
        ref={forwardedRef}
        className={cn(
          "-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2",
          className,
        )}
      >
        <svg
          className="rotate-[-90deg] transform"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          fill="none"
          stroke="currentColor"
        >
          <circle
            className="text-primary/20"
            strokeWidth="2"
            cx={size / 2}
            cy={size / 2}
            r={(size - 4) / 2}
          />
          <circle
            className="text-primary transition-all"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            cx={size / 2}
            cy={size / 2}
            r={(size - 4) / 2}
          />
        </svg>
      </ItemProgressPrimitive>
    );
  }

  return (
    <ItemProgressPrimitive
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={itemContext.fileState.progress}
      aria-valuetext={`${itemContext.fileState.progress}%`}
      aria-labelledby={itemContext.nameId}
      data-slot="file-upload-progress"
      {...progressProps}
      ref={forwardedRef}
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-full bg-primary/20",
        className,
      )}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{
          transform: `translateX(-${100 - itemContext.fileState.progress}%)`,
        }}
      />
    </ItemProgressPrimitive>
  );
});
FileUploadItemProgress.displayName = ITEM_PROGRESS_NAME;

interface FileUploadItemDeleteProps extends ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
}

const FileUploadItemDelete = forwardRef<
  HTMLButtonElement,
  FileUploadItemDeleteProps
>((props, forwardedRef) => {
  const { asChild, ...deleteProps } = props;

  const store = useStoreContext(ITEM_DELETE_NAME);
  const itemContext = useFileUploadItemContext(ITEM_DELETE_NAME);
  const propsRef = useAsRef(deleteProps);

  const onClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      propsRef.current?.onClick?.(event);

      if (!itemContext.fileState || event.defaultPrevented) return;

      store.dispatch({
        variant: "REMOVE_FILE",
        file: itemContext.fileState.file,
      });
    },
    [store, itemContext.fileState, propsRef],
  );

  if (!itemContext.fileState) return null;

  const ItemDeletePrimitive = asChild ? Slot : "button";

  return (
    <ItemDeletePrimitive
      type="button"
      aria-controls={itemContext.id}
      aria-describedby={itemContext.nameId}
      data-slot="file-upload-item-delete"
      {...deleteProps}
      ref={forwardedRef}
      onClick={onClick}
    />
  );
});
FileUploadItemDelete.displayName = ITEM_DELETE_NAME;

interface FileUploadClearProps extends ComponentPropsWithoutRef<"button"> {
  forceMount?: boolean;
  asChild?: boolean;
}

const FileUploadClear = forwardRef<HTMLButtonElement, FileUploadClearProps>(
  (props, forwardedRef) => {
    const { asChild, forceMount, disabled, ...clearProps } = props;

    const context = useFileUploadContext(CLEAR_NAME);
    const store = useStoreContext(CLEAR_NAME);
    const propsRef = useAsRef(clearProps);

    const isDisabled = disabled || context.disabled;

    const onClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        propsRef.current?.onClick?.(event);

        if (event.defaultPrevented) return;

        store.dispatch({ variant: "CLEAR" });
      },
      [store, propsRef],
    );

    const storeRender = useStore((state) => state.files.size > 0);

    const shouldRender = forceMount || storeRender;

    if (!shouldRender) return null;

    const ClearPrimitive = asChild ? Slot : "button";

    return (
      <ClearPrimitive
        type="button"
        aria-controls={context.listId}
        data-slot="file-upload-clear"
        data-disabled={isDisabled ? "" : undefined}
        {...clearProps}
        ref={forwardedRef}
        disabled={isDisabled}
        onClick={onClick}
      />
    );
  },
);
FileUploadClear.displayName = CLEAR_NAME;

const FileUpload = FileUploadRoot;

interface ComposedFileUploaderProps {
  maxFiles: number;
  maxSize: number;
  acceptedFileTypes: MimeType[];
  disabled: boolean;
  onFilesChange: (files: File[]) => void;
  action?: ReactNode;
}

export const ComposedFileUploader = ({
  maxFiles,
  maxSize,
  acceptedFileTypes,
  disabled,
  onFilesChange,
  action,
}: ComposedFileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const onFileReject = useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  const handleFilesChange = useCallback(
    (newFiles: File[]) => {
      setFiles(newFiles);
      onFilesChange?.(newFiles);
    },
    [onFilesChange],
  );

  return (
    <FileUpload
      maxFiles={maxFiles}
      maxSize={maxSize}
      value={files}
      onValueChange={handleFilesChange}
      onFileReject={onFileReject}
      accept={
        acceptedFileTypes.length > 0 ? acceptedFileTypes.join(",") : undefined
      }
      multiple={maxFiles > 1}
      disabled={disabled}
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">Drag & drop files here</p>
          <p className="text-muted-foreground text-xs">
            Or click to browse (max {maxFiles} file{maxFiles === 1 ? "" : "s"},
            up to {formatBytes({ bytes: maxSize })} each)
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit">
            Browse files
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      {action && <>{action}</>}
      <FileUploadList>
        {files.map((file, index) => (
          <FileUploadItem key={index} value={file}>
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            {!disabled && (
              <FileUploadItemDelete asChild>
                <Button variant="ghost" size="icon" className="size-7">
                  <X />
                </Button>
              </FileUploadItemDelete>
            )}
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
};

import {
  type ColumnDef,
  type Row,
  type SortingState,
} from "@tanstack/react-table";
import { DownloadIcon, MoreHorizontal, PlusIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Routes } from "@/app/routes/routes";
import { Button } from "@/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import {
  InfiniteScrollTable,
  InfiniteScrollTableActionHeader,
  InfiniteScrollTableHeader,
} from "@/components/infinite-scroll-table";
import { useNavigate } from "@/hooks/use-navigate";

enum DocumentKeys {
  ID = "id",
  NAME = "name",
  CREATED_AT = "createdAt",
  STATUS = "status",
}

export type Document = {
  [DocumentKeys.ID]: string;
  [DocumentKeys.NAME]: string;
  [DocumentKeys.STATUS]: string;
};

export const DocumentPage = () => {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [sorting, setSorting] = useState<SortingState>([
    { id: DocumentKeys.CREATED_AT, desc: true },
  ]);

  const handleRowClick = useCallback(
    (row: Row<Document>) => {
      navigate({
        route: `${Routes.DocumentReview}/${row.original.id}`,
      });
    },
    [navigate],
  );

  const documentColumns = useMemo<ColumnDef<Document>[]>(
    () => [
      {
        accessorKey: DocumentKeys.NAME,
        header: ({ column }) => (
          <InfiniteScrollTableHeader name="Name" column={column} />
        ),
        enableSorting: true,
      },
      {
        accessorKey: DocumentKeys.CREATED_AT,
        header: ({ column }) => (
          <InfiniteScrollTableHeader name="Uploaded on" column={column} />
        ),
        enableSorting: true,
      },
      {
        accessorKey: DocumentKeys.STATUS,
        header: ({ column }) => (
          <InfiniteScrollTableHeader name="Status" column={column} />
        ),
        enableSorting: true,
      },
      {
        id: "actions",
        header: () => <InfiniteScrollTableActionHeader />,
        enableSorting: false,
        cell: () => (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="text-right">
                <Button
                  variant="secondary"
                  className="h-8 w-8 p-0 flex justify-center items-center ml-auto"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {}}>
                  <DownloadIcon />
                  Retry
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <InfiniteScrollTable<Document>
      data={[]}
      hasNextPage={false}
      fetchNextPage={() => {}}
      isFetchingNextPage={false}
      columns={documentColumns}
      globalFilterConfig={{
        globalFilter,
        onGlobalFilterChange: setGlobalFilter,
      }}
      sortingConfig={{
        sorting,
        onSortingChange: setSorting,
      }}
      onRowClick={handleRowClick}
      action={
        <Link to={Routes.DocumentUpload}>
          <Button size="sm" variant="outline">
            <div className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Upload Documents
            </div>
          </Button>
        </Link>
      }
    />
  );
};

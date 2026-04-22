import {
  type Column,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type GlobalFilterTableState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { type ReactNode, useState } from "react";

import { Input } from "@/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  action?: ReactNode;
}

export function ClientDataTable<TData, TValue>({
  columns,
  data,
  action,
}: Readonly<DataTableProps<TData, TValue>>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<GlobalFilterTableState>();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search"
          onChange={(e) => table.setGlobalFilter(String(e.target.value))}
          className="max-w-xs"
        />
        {action && <div>{action}</div>}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

type ClientDataTableHeaderProps<T> = {
  name: string;
  column: Column<T, unknown>;
};

export function ClientDataTableHeader<T>({
  name,
  column,
}: Readonly<ClientDataTableHeaderProps<T>>) {
  const isSorted = column.getIsSorted();

  return (
    <div
      role="button"
      tabIndex={0}
      className="w-full flex items-center gap-2 cursor-pointer"
      onClick={() => column.toggleSorting(isSorted === "asc")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          column.toggleSorting(isSorted === "asc");
        }
      }}
    >
      {name}
      {isSorted ? (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      ) : (
        <div className="ml-2 h-4 w-4" />
      )}
    </div>
  );
}

export function ClientDataTableActionHeader() {
  return <div className="w-full text-right px-1">Actions</div>;
}

import {
  type Column,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type SortingState,
  useReactTable,
  type OnChangeFn,
  type Row,
  type RowSelectionState,
  type VisibilityState,
} from "@tanstack/react-table";
import { isEmpty } from "lodash-es";
import { Loader, ArrowUp, ArrowDown } from "lucide-react";
import { type ReactNode, useCallback, useMemo, useRef } from "react";

import { Button } from "@/components/button";
import { Checkbox } from "@/components/checkbox";
import { Input } from "@/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export type SelectionConfig<TData> = {
  rowSelection: RowSelectionState;
  onRowSelectionChange: (selection: RowSelectionState) => void;
  enableRowSelection?: (row: Row<TData>) => boolean;
  getRowId: (row: TData, index: number) => string;
};

export type BulkAction<TData> = {
  icon: ReactNode;
  onClick: (selectedRows: TData[], clearSelection: () => void) => void;
  tooltip: string;
  disabled?: boolean;
};

export type SortingConfig = {
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
};

export type GlobalFilterConfig = {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
};

export type ColumnVisibilityConfig = {
  columnVisibility: VisibilityState;
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
};

export type InfiniteScrollTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  sortingConfig?: SortingConfig;
  globalFilterConfig?: GlobalFilterConfig;
  selectionConfig?: SelectionConfig<TData>;
  columnVisibilityConfig?: ColumnVisibilityConfig;
  bulkActions?: BulkAction<TData>[];
  emptyComponent?: ReactNode;
  action?: ReactNode;
  onRowClick?: (row: Row<TData>, data: TData) => void;
};

export const InfiniteScrollTable = <TData,>({
  columns,
  data,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  sortingConfig,
  globalFilterConfig,
  selectionConfig,
  columnVisibilityConfig,
  bulkActions,
  emptyComponent,
  action,
  onRowClick,
}: InfiniteScrollTableProps<TData>) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const sortingEnabled = useMemo(() => !!sortingConfig, [sortingConfig]);
  const filterEnabled = useMemo(
    () => !!globalFilterConfig,
    [globalFilterConfig],
  );
  const selectionEnabled = useMemo(() => !!selectionConfig, [selectionConfig]);

  const columnVisibility = useMemo(
    () => columnVisibilityConfig?.columnVisibility ?? {},
    [columnVisibilityConfig],
  );

  const columnVisibilityEnabled = useMemo(
    () => !!columnVisibilityConfig,
    [columnVisibilityConfig],
  );

  const sortingState = useMemo(
    () => sortingConfig?.sorting ?? [],
    [sortingConfig],
  );
  const filterValue = useMemo(
    () => globalFilterConfig?.globalFilter ?? "",
    [globalFilterConfig],
  );
  const rowSelection = useMemo(
    () => selectionConfig?.rowSelection ?? {},
    [selectionConfig],
  );

  const enableRowSelection = useMemo(() => {
    if (selectionConfig?.enableRowSelection) {
      return selectionConfig.enableRowSelection;
    }
    return () => selectionEnabled;
  }, [selectionConfig, selectionEnabled]);

  const tableColumns = useMemo(() => {
    return selectionEnabled
      ? [createSelectionColumn<TData>(), ...columns]
      : columns;
  }, [selectionEnabled, columns]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: sortingConfig?.onSortingChange as OnChangeFn<SortingState>,
    onRowSelectionChange:
      selectionConfig?.onRowSelectionChange as OnChangeFn<RowSelectionState>,
    getRowId: selectionEnabled
      ? selectionConfig?.getRowId || ((_, index) => index.toString())
      : undefined,
    state: {
      sorting: sortingEnabled ? sortingState : undefined,
      rowSelection: selectionEnabled ? rowSelection : undefined,
      columnVisibility: columnVisibilityEnabled ? columnVisibility : undefined,
    },
    enableSorting: sortingEnabled,
    enableRowSelection,
    manualSorting: true,
    manualFiltering: true,
    enableHiding: true,
  });

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useIntersectionObserver({
    ref: loadMoreRef,
    callback: loadMore,
  });

  const handleFilterChange = useCallback(
    (value: string) => {
      globalFilterConfig?.onGlobalFilterChange(value);
    },
    [globalFilterConfig],
  );

  const handleRowClick = useCallback(
    (row: Row<TData>) => {
      if (onRowClick) {
        onRowClick(row, row.original);
      }
    },
    [onRowClick],
  );

  const clickEnabled = useMemo(() => !!onRowClick, [onRowClick]);

  const selectedRows = useMemo(() => {
    if (!selectionEnabled) return [];
    const selectedRowModel = table.getSelectedRowModel();
    return selectedRowModel.rows.map((row) => row.original);
  }, [selectionEnabled, table]);

  const clearSelection = useCallback(() => {
    if (selectionConfig?.onRowSelectionChange) {
      selectionConfig.onRowSelectionChange({});
    }
  }, [selectionConfig]);

  return (
    <div className="flex flex-col gap-4">
      <TableControls
        filterEnabled={filterEnabled}
        filterValue={filterValue}
        onFilterChange={handleFilterChange}
        selectionEnabled={selectionEnabled}
        bulkActions={bulkActions}
        selectedRows={selectedRows}
        clearSelection={clearSelection}
        action={action}
      />

      <TableContent
        table={table}
        data={data}
        columns={columns}
        emptyComponent={emptyComponent}
        selectionEnabled={selectionEnabled}
        clickEnabled={clickEnabled}
        onRowClick={handleRowClick}
      />

      <LoadMoreSection
        data={data}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        loadMoreRef={loadMoreRef}
      />
    </div>
  );
};

type TableControlsProps<TData> = {
  filterEnabled: boolean;
  filterValue: string;
  onFilterChange: (value: string) => void;
  selectionEnabled: boolean;
  bulkActions?: BulkAction<TData>[];
  selectedRows: TData[];
  clearSelection: () => void;
  action?: ReactNode;
};

const TableControls = <TData,>({
  filterEnabled,
  filterValue,
  onFilterChange,
  selectionEnabled,
  bulkActions,
  selectedRows,
  clearSelection,
  action,
}: TableControlsProps<TData>) => {
  return (
    <div className="flex items-center justify-between">
      {filterEnabled ? (
        <Input
          placeholder="Search"
          value={filterValue}
          onChange={(e) => onFilterChange(e.target.value)}
          className="max-w-xs"
        />
      ) : (
        <div />
      )}
      <div className="flex items-center gap-2">
        {selectionEnabled && bulkActions && selectedRows.length > 0 && (
          <BulkActionControls
            bulkActions={bulkActions}
            selectedRows={selectedRows}
            clearSelection={clearSelection}
          />
        )}
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};

type BulkActionControlsProps<TData> = {
  bulkActions: BulkAction<TData>[];
  selectedRows: TData[];
  clearSelection: () => void;
};

const BulkActionControls = <TData,>({
  bulkActions,
  selectedRows,
  clearSelection,
}: BulkActionControlsProps<TData>) => {
  return (
    <div className="flex items-center gap-2">
      {bulkActions.map((bulkAction) => (
        <Tooltip key={bulkAction.tooltip}>
          <TooltipContent>{bulkAction.tooltip}</TooltipContent>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={bulkAction.disabled}
              onClick={() => bulkAction.onClick(selectedRows, clearSelection)}
            >
              {bulkAction.icon}
            </Button>
          </TooltipTrigger>
        </Tooltip>
      ))}
    </div>
  );
};

type TableContentProps<TData> = {
  table: ReturnType<typeof useReactTable<TData>>;
  data: TData[];
  columns: ColumnDef<TData>[];
  emptyComponent?: ReactNode;
  selectionEnabled: boolean;
  clickEnabled: boolean;
  onRowClick?: (row: Row<TData>, event: React.MouseEvent) => void;
};

const TableContent = <TData,>({
  table,
  data,
  columns,
  emptyComponent,
  selectionEnabled,
  clickEnabled,
  onRowClick,
}: TableContentProps<TData>) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeaderSection table={table} />
        <TableBodySection
          table={table}
          data={data}
          columns={columns}
          emptyComponent={emptyComponent}
          selectionEnabled={selectionEnabled}
          clickEnabled={clickEnabled}
          onRowClick={onRowClick}
        />
      </Table>
    </div>
  );
};

type TableHeaderSectionProps<TData> = {
  table: ReturnType<typeof useReactTable<TData>>;
};

const TableHeaderSection = <TData,>({
  table,
}: TableHeaderSectionProps<TData>) => {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
};

type TableBodySectionProps<TData> = {
  table: ReturnType<typeof useReactTable<TData>>;
  data: TData[];
  columns: ColumnDef<TData>[];
  emptyComponent?: ReactNode;
  selectionEnabled: boolean;
  clickEnabled: boolean;
  onRowClick?: (row: Row<TData>, event: React.MouseEvent) => void;
};

const TableBodySection = <TData,>({
  table,
  data,
  columns,
  emptyComponent,
  selectionEnabled,
  clickEnabled,
  onRowClick,
}: TableBodySectionProps<TData>) => {
  if (isEmpty(data)) {
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={selectionEnabled ? columns.length + 1 : columns.length}
            className="h-24 text-center text-muted-foreground"
          >
            {emptyComponent || "No data available"}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (!table.getRowModel().rows?.length) {
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={selectionEnabled ? columns.length + 1 : columns.length}
            className="h-24 text-center"
          >
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {table.getRowModel().rows.map((row) => (
        <TableRowComponent
          key={row.id}
          row={row}
          selectionEnabled={selectionEnabled}
          clickEnabled={clickEnabled}
          onRowClick={onRowClick}
        />
      ))}
    </TableBody>
  );
};

type TableRowComponentProps<TData> = {
  row: Row<TData>;
  selectionEnabled: boolean;
  clickEnabled: boolean;
  onRowClick?: (row: Row<TData>, event: React.MouseEvent) => void;
};

const TableRowComponent = <TData,>({
  row,
  selectionEnabled,
  clickEnabled,
  onRowClick,
}: TableRowComponentProps<TData>) => {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (onRowClick) {
        onRowClick(row, e);
      }
    },
    [onRowClick, row],
  );

  const isSelected = useMemo(() => {
    return selectionEnabled && row.getIsSelected?.();
  }, [selectionEnabled, row]);

  return (
    <TableRow
      data-state={isSelected ? "selected" : undefined}
      onClick={clickEnabled ? handleClick : undefined}
      className={clickEnabled ? "cursor-pointer" : ""}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
};

type LoadMoreSectionProps<TData> = {
  data: TData[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
};

const LoadMoreSection = <TData,>({
  data,
  hasNextPage,
  isFetchingNextPage,
  loadMoreRef,
}: LoadMoreSectionProps<TData>) => {
  if (isEmpty(data) || !hasNextPage) {
    return null;
  }

  return (
    <div ref={loadMoreRef} className="flex items-center justify-center p-4">
      {isFetchingNextPage ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Loading more...
        </>
      ) : (
        <div className="text-muted-foreground">Scroll to load more</div>
      )}
    </div>
  );
};

type InfiniteScrollTableHeaderProps<T> = {
  name: string;
  column: Column<T, unknown>;
  enableSorting?: boolean;
};

export const InfiniteScrollTableHeader = <T,>({
  name,
  column,
  enableSorting = true,
}: InfiniteScrollTableHeaderProps<T>) => {
  const isSorted = column.getIsSorted();
  const canSort = enableSorting && column.getCanSort();

  return (
    <div
      role="button"
      tabIndex={canSort ? 0 : undefined}
      className={`w-full flex items-center gap-2 ${canSort ? "cursor-pointer" : ""}`}
      onClick={
        canSort ? () => column.toggleSorting(isSorted === "asc") : undefined
      }
      onKeyDown={(e) => {
        if (canSort && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          column.toggleSorting(isSorted === "asc");
        }
      }}
    >
      {name}
      {canSort && (
        <>
          {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
          {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
          {!isSorted && <div className="ml-2 h-4 w-4" />}
        </>
      )}
    </div>
  );
};

export const InfiniteScrollTableActionHeader = () => {
  return <div className="w-full text-right px-1">Actions</div>;
};

export const createSelectionColumn = <TData,>(): ColumnDef<TData> => {
  return {
    id: "select",
    header: ({ table }) => {
      const allSelected = table.getIsAllPageRowsSelected();
      const someSelected = table.getIsSomePageRowsSelected();
      const hasSelectableRows = table
        .getRowModel()
        .rows.some((row) => row.getCanSelect());

      if (!hasSelectableRows) {
        return <div />;
      }

      return (
        <Checkbox
          checked={allSelected || (someSelected && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      );
    },
    cell: ({ row }) => {
      const isSelected = row.getIsSelected();
      const isSelectable = row.getCanSelect();

      if (!isSelectable) {
        return <div />;
      }

      return (
        <Checkbox
          checked={isSelected}
          onClick={(e) => e.stopPropagation()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
    size: 40,
  };
};

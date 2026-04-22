import { type ColumnDef } from "@tanstack/react-table";
import { DownloadIcon, MoreHorizontal } from "lucide-react";
import { useCallback, useMemo } from "react";

import { Badge } from "@/components/badge";
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
import { centsToDollars } from "@/lib/utils/currency";
import { handleError } from "@/network/error";
import { useBillingMutations } from "@/network/modules/billing";
import {
  INVOICES_TABLE_COLUMNS,
  type InvoiceTableProperties,
} from "@/pages/settings/workspace/billing/invoices-page/consts";

type InvoicesPageProps = {
  data: InvoiceTableProperties[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
};

export const InvoicesPage = ({
  data,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: InvoicesPageProps) => {
  const { downloadInvoice } = useBillingMutations();

  const handleDownloadInvoice = useCallback(
    async (date: number, downloadUrl: string) => {
      try {
        await downloadInvoice.mutateAsync({ date, downloadUrl });
      } catch (error) {
        handleError(error);
      }
    },
    [downloadInvoice],
  );

  const columns = useMemo<ColumnDef<InvoiceTableProperties>[]>(
    () => [
      {
        accessorKey: INVOICES_TABLE_COLUMNS.DATE,
        header: ({ column }) => (
          <InfiniteScrollTableHeader
            name="Date"
            column={column}
            enableSorting={false}
          />
        ),
        cell: ({ cell }) => {
          const date = new Date(cell.getValue<number>());
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        },
      },
      {
        accessorKey: INVOICES_TABLE_COLUMNS.AMOUNT,
        header: ({ column }) => (
          <InfiniteScrollTableHeader
            name="Amount"
            column={column}
            enableSorting={false}
          />
        ),
        cell: ({ cell }) => {
          const amount = cell.getValue<number>();
          return centsToDollars(amount);
        },
      },
      {
        accessorKey: INVOICES_TABLE_COLUMNS.STATUS,
        header: ({ column }) => (
          <InfiniteScrollTableHeader name="Status" column={column} />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue<string>();
          return <Badge variant="outline">{status}</Badge>;
        },
      },
      {
        id: "actions",
        header: () => <InfiniteScrollTableActionHeader />,
        cell: ({ row }) => (
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
                <DropdownMenuItem
                  onClick={() =>
                    handleDownloadInvoice(
                      row.original.date,
                      row.original.downloadUrl,
                    )
                  }
                >
                  <DownloadIcon />
                  Download
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [handleDownloadInvoice],
  );

  return (
    <InfiniteScrollTable<InvoiceTableProperties>
      data={data}
      columns={columns}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
};

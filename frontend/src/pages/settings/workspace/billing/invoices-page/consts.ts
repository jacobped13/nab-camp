import { type Invoice } from "@shared/api-contracts/billing";

export enum INVOICES_TABLE_COLUMNS {
  ID = "id",
  DATE = "date",
  AMOUNT = "amount",
  STATUS = "status",
  DOWNLOAD_URL = "downloadUrl",
  ACTIONS = "actions",
}

export type InvoiceTableProperties = {
  [INVOICES_TABLE_COLUMNS.ID]: string;
  [INVOICES_TABLE_COLUMNS.DATE]: number;
  [INVOICES_TABLE_COLUMNS.AMOUNT]: number;
  [INVOICES_TABLE_COLUMNS.STATUS]: string;
  [INVOICES_TABLE_COLUMNS.DOWNLOAD_URL]: string;
};

type MapToInvoiceTableStructure = {
  data: Invoice[];
};

export const mapToInvoiceTableStructure = ({
  data,
}: MapToInvoiceTableStructure): InvoiceTableProperties[] => {
  if (!data) return [];

  return data.map((item) => ({
    [INVOICES_TABLE_COLUMNS.ID]: item.id,
    [INVOICES_TABLE_COLUMNS.DATE]: item.createdAt,
    [INVOICES_TABLE_COLUMNS.AMOUNT]: item.amount,
    [INVOICES_TABLE_COLUMNS.STATUS]: item.status,
    [INVOICES_TABLE_COLUMNS.DOWNLOAD_URL]: item.downloadUrl ?? "",
  }));
};

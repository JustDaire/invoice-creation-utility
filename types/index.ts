import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Company = {
  name: string;
  email: string;
  phone: string;
  address: string;
  vat_number?: string;
};

export type InvoiceItem = {
  key: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type InvoiceForm = {
  invoiceNumber: string;
  invoiceDate: string;
  invoiceDueDate: string;
  company: Company;
  client: Company;
  items: InvoiceItem[];
  description: string;
  taxtRate: number;
  subtotal: number;
  total: number;
};
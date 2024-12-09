"use client";

import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/table";
import React, { useState } from "react";

type Column = {
  key: string;
  label: string;
  type: "text" | "number";
};

type Comppany = {
  name: string;
  email: string;
  phone: string;
  address: string;
  vat_number: string;
};

type InvoiceItem = {
  key: string;
  description: string;
  rate: number;
  quantity: number;
  amount: number;
};

const columns = [
  {
    key: "actions",
    label: "ACTIONS",
    type: "text",
  },
  {
    key: "description",
    label: "DESCRIPTION",
    type: "text",
  },
  {
    key: "rate",
    label: "RATE",
    type: "number",
  },
  {
    key: "quantity",
    label: "QUANTITY",
    type: "number",
  },
  {
    key: "amount",
    label: "AMOUNT",
    type: "number",
  },
];

export default function Home() {
  const [formData, setFormData] = useState({
    invoiceNumber: "INV0001",
    company: {
      name: "",
      email: "",
      phone: "",
      address: "",
      vat_number: "",
    },
    client: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    invoiceItems: [
      {
        key: "1",
        description: "",
        rate: 0,
        quantity: 1,
        amount: 0,
      },
    ],
    description: "",
  });

  const renderCell = React.useCallback(
    (invoiceItem: InvoiceItem, columnKey: React.Key) => {
      const cellValue = invoiceItem[columnKey as keyof InvoiceItem];

      switch (columnKey) {
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Button
                isIconOnly
                aria-label="Delete"
                color="danger"
                onClick={() => removeRow(Number(invoiceItem.key))}
              >
                X
              </Button>
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  /**
   * Adds a new row to the invoice items in the form data.
   * The new row will have a unique key, an empty description, a rate of 0,
   * a quantity of 1, and an amount of 0.
   * Updates the form data state with the new row added to the invoice items array.
   */
  const addRow = () => {
    const newRow = {
      key: String(formData.invoiceItems.length + 1),
      description: "",
      rate: 0,
      quantity: 1,
      amount: 0,
    };

    const array = formData.invoiceItems;

    array.push(newRow);

    setFormData({
      ...formData,
      invoiceItems: array,
    });
  };

  /**
   * Removes a row from the invoice items based on the provided row index.
   *
   * @param {number} rowIndex - The index of the row to be removed.
   *
   * This function filters out the row from the `invoiceItems` array in the
   * `formData` state, and updates the state with the new array.
   */
  const removeRow = (rowIndex: number) => {
    const array = formData.invoiceItems.filter(
      (a) => a.key !== String(rowIndex)
    );

    setFormData({
      ...formData,
      invoiceItems: array,
    });
  };
  const generateInvoice = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("formData", formData);
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      {/* Main grid */}
      {/*   */}
      <form className="grid gap-4" onSubmit={generateInvoice}>
        <div className="grid grid-cols-2 gap-4 flex items-start">
          {/* Issuer details */}
          <div className="grid gap-4">
            <Input
              aria-label="Company Name"
              label="Name"
              type="text"
              value={formData.company.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  company: {
                    ...formData.company,
                    name: e.target.value,
                  },
                })
              }
            />
            <Input
              aria-label="Company Email"
              label="Email"
              type="email"
              value={formData.company.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  company: {
                    ...formData.company,
                    email: e.target.value,
                  },
                })
              }
            />
            <Input
              aria-label="Company Phone"
              label="Phone"
              type="text"
              value={formData.company.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  company: {
                    ...formData.company,
                    phone: e.target.value,
                  },
                })
              }
            />
            <Textarea
              aria-label="Company address"
              label="Address"
              value={formData.company.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  company: {
                    ...formData.company,
                    address: e.target.value,
                  },
                })
              }
            />
            <Input
              aria-label="Company VAT Number"
              label="VAT Number"
              type="text"
              value={formData.company.vat_number}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  company: {
                    ...formData.company,
                    vat_number: e.target.value,
                  },
                })
              }
            />
          </div>
          {/* Client details */}
          <div className="grid gap-4">
            <Input
              aria-label="Client Name"
              label="Name"
              type="text"
              value={formData.client.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  client: {
                    ...formData.client,
                    name: e.target.value,
                  },
                })
              }
            />
            <Input
              aria-label="Client Email"
              label="Email"
              type="email"
              value={formData.client.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  client: {
                    ...formData.client,
                    email: e.target.value,
                  },
                })
              }
            />
            <Input
              aria-label="Client Phone"
              label="Phone"
              type="text"
              value={formData.client.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  client: {
                    ...formData.client,
                    phone: e.target.value,
                  },
                })
              }
            />
            <Textarea
              aria-label="Client address"
              label="Address"
              value={formData.client.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  client: {
                    ...formData.client,
                    address: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {/* Invoice Number */}
          <div className="grid gap-4">
            <Input
              aria-label="Invoice Number"
              label="Invoice Number"
              type="text"
              value={formData.invoiceNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  invoiceNumber: e.target.value,
                })
              }
            />
          </div>
          {/* Invoice Date Picker */}
          <div className="grid gap-4">Invoice Date</div>
          {/* Terms Selector */}
          <div className="grid gap-4">
            Terms
            <br />
            Due Date
          </div>
        </div>
        {/* Invoice items */}
        <div className="grid grid-cols-1 gap-4">
          <div className="grid gap-4">
            <Table removeWrapper>
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.key} aria-label={column.label}>
                    {column.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={formData.invoiceItems}>
                {(item) => (
                  <TableRow key={item.key}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <Button
              isIconOnly
              aria-label="Add"
              color="default"
              onClick={addRow}
            >
              +
            </Button>
          </div>
        </div>
        {/* Invoice notes */}
        <div className="grid grid-cols-1 gap-4">
          <div className="grid gap-4">
            <Textarea
              label="Notes"
              placeholder="Enter your description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />
          </div>
        </div>
        {/* Invoice actions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-4">
            <Button aria-label="Submit" color="default" type="submit">
              Generate
            </Button>
          </div>
          <div className="grid gap-4">
            <Button aria-label="Submit" color="danger">
              Reset
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}

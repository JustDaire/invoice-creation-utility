"use client";

import {
  CalendarDate,
  DateValue,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import React, { Key, useMemo, useState } from "react";
import { Divider } from "@nextui-org/divider";
import { Select, SelectItem } from "@nextui-org/select";
import { DatePicker } from "@nextui-org/date-picker";
import { MdAdd, MdDelete } from "react-icons/md";
import { termPeriods } from "./data";
import { InvoiceForm, InvoiceItem } from "@/types";

type Column = {
  key: string;
  label: string;
  type: "text" | "number";
};

const columns = [
  {
    key: "actions",
    label: "",
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

const invoiceForm: InvoiceForm = {
  invoiceNumber: "INV0001",
  invoiceDate: "",
  invoiceDueDate: "",
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
  items: [
    {
      key: "1",
      description: "Item 1",
      unitPrice: 0,
      quantity: 1,
      total: 0,
    },
  ],
  description: "",
  taxtRate: 0,
  subtotal: 0.0,
  total: 0.0,
};

const invoiceFormTest = {
  invoiceNumber: "INV0001",
  invoiceDate: "",
  invoiceDueDate: "",
  company: {
    name: "MegaCorp",
    email: "me@smallcompany.com",
    phone: "978123456",
    address: "Dublin, Ireland",
    vat_number: "",
  },
  client: {
    name: "MegaCorp",
    email: "billing@megacorp.com",
    phone: "645174526",
    address: "California, USA",
  },
  items: [
    {
      key: "1",
      description: "Item 1",
      unitPrice: 0,
      quantity: 1,
      total: 0,
    },
  ],
  description: "",
  taxtRate: 0,
  subtotal: 0.0,
  total: 0.0,
};

export default function Home() {
  let defaultDate = today(getLocalTimeZone());
  const [formData, setFormData] = useState(invoiceFormTest);
  const [date, setDate] = React.useState<DateValue | null>(defaultDate);
  const [term, setTerm] = React.useState<string>("");
  const [dueDate, setDueDate] = React.useState<DateValue | null>(null);
  let formatter = useDateFormatter({ dateStyle: "full" });

  function getDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();

    const formattedDate = formatter.format(today);

    console.log("formattedDate:", formattedDate);

    // {date ? formatter.format(date.toDate(getLocalTimeZone())) : "--"}
    console.log("Date:", today);

    return `${month}/${date}/${year}`;
  }

  const renderTotal = (
    item: InvoiceItem,
    columnKey: React.Key,
    index: number
  ) => {
    const total = item.unitPrice * item.quantity;

    console.log("calculating total");

    // setFormData({
    //   ...formData,
    //   total,
    // });
    UpdateCell(total, Number(item.key), "total");

    return total;
  };

  const calculateTotal = () => {
    const invoiceItems = formData.items.map((a) => a.total);
    const invoiceTotal = invoiceItems.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    console.log(invoiceTotal);
    setFormData({
      ...formData,
      total: invoiceTotal,
    });
    return invoiceTotal;
  };

  const invoiceTotalCalculated = useMemo(
    () => calculateTotal(),
    [formData.items]
  );

  const termSelection = (term: string) => {
    const termNumber = termPeriods.find((a) => a.key === term)?.value;
    if (term) {
      const invoiceDate = new CalendarDate(date!.year, date!.month, date!.day);
      const invoiceDueDate = invoiceDate.add({days: Number(termNumber)});
      setDueDate(invoiceDueDate);
    }

    setTerm(term.toString());

  }

  /**
   * Renders a cell in the invoice table based on the column key.
   *
   * @param {InvoiceItem} invoiceItem - The invoice item data for the current row.
   * @param {React.Key} columnKey - The key of the column to render.
   * @returns {React.ReactNode} The rendered cell content.
   */
  const renderCell = React.useCallback(
    (invoiceItem: InvoiceItem, columnKey: React.Key, index: number) => {
      const cellValue = invoiceItem[columnKey as keyof InvoiceItem];

      switch (columnKey) {
        case "actions":
          return (
            <Button
              isIconOnly
              aria-label="Delete"
              color="danger"
              isDisabled={formData.items.length === 1}
              onPress={() => removeRow(Number(invoiceItem.key))}
            >
              <MdDelete size={24} />
            </Button>
          );
        case "amount":
          // return cellValue;
          // return renderTotal(invoiceItem, columnKey, index);
          return (
            <>
              {cellValue}
              {invoiceItem[columnKey as keyof InvoiceItem]}
              <TableCellInput
                type={getInputType(columnKey)}
                value={String(cellValue)}
                onChange={(newValue) => {
                  // Logic to update local state with the new value
                  UpdateCell(newValue, index, columnKey);
                }}
              />
            </>
          );
        default:
          return (
            <TableCellInput
              type={getInputType(columnKey)}
              value={String(cellValue)}
              onChange={(newValue) => {
                // Logic to update local state with the new value
                UpdateCell(newValue, index, columnKey);
              }}
            />
          );
      }
    },
    []
  );

  /**
   * Updates a specific cell in the invoice items form data.
   *
   * @param value - The new value to be set in the cell.
   * @param index - The index of the invoice item to be updated.
   * @param columnKey - The key of the column to be updated.
   */
  const UpdateCell = (value: any, index: number, columnKey: Key) => {
    const invoiceItemsUpdated = [...formData.items];
    const invoiceItem = invoiceItemsUpdated.find(
      (a) => a.key === String(index)
    );

    if (invoiceItem) {
      (invoiceItem as any)[columnKey as string] = value;
    }


    // formData.company.phone = "3";
    invoiceItem!.total = invoiceItem!.unitPrice * invoiceItem!.quantity;
    formData.company.phone = String(invoiceItem!.total);

    console.log("formData", formData);

    setFormData({
      ...formData,
      items: invoiceItemsUpdated,
    });
    // setFormData(formData);
  };

  /**
   * Adds a new row to the invoice items in the form data.
   * The new row will have a unique key, an empty description, a rate of 0,
   * a quantity of 1, and an amount of 0.
   * Updates the form data state with the new row added to the invoice items array.
   */
  const addRow = () => {
    const newRow = {
      key: String(formData.items.length + 1),
      description: "",
      unitPrice: 0,
      quantity: 1,
      total: 0,
    };

    const array = formData.items;

    array.push(newRow);

    setFormData({
      ...formData,
      items: array,
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
    const array = formData.items.filter(
      (a) => a.key !== String(rowIndex)
    );

    setFormData({
      ...formData,
      items: array,
    });
  };

  /**
   * Generates an invoice based on the form data.
   *
   * @param e - The event object that triggered the function, which includes a preventDefault method to stop the default form submission behavior.
   */
  const generateInvoice = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("formData", formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, type: string) => {

    const newInvoiceItems = [...formData.items];
    const invoiceItem = newInvoiceItems.find((a) => a.key === String(index));
    if (invoiceItem) {
      (invoiceItem as any)[type as keyof InvoiceItem] = e.target.value;
      if (type === "rate" || type === "quantity") {
        invoiceItem!.total = invoiceItem!.unitPrice * invoiceItem!.quantity;
      }
      console.log("invoiceItem", invoiceItem);
    }

    setFormData({
      ...formData,
      items: newInvoiceItems,
    });
  };

  /**
   * Retrieves the input type for a given key from the columns array.
   *
   * @param {Key} key - The key to search for in the columns array.
   * @returns {string} - The input type associated with the key, or "" if the key is not found.
   */
  const getInputType = (key: Key) => {
    return columns.find((a) => a.key === key)?.type ?? "";
  };

  const TableCellInput = ({
    value,
    onChange,
    type,
  }: {
    value: string;
    onChange: (value: string) => void;
    type?: string;
  }) => {
    const [inputValue, setInputValue] = React.useState(value);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      onChange(e.target.value);
    };

    return (
      <Input type={type} value={inputValue} onChange={handleInputChange} />
    );
  };

  return (
    <section className="flex flex-col md:items-center justify-center gap-4 py-8 md:py-10">
      {/* Main grid */}
      {/*   */}
      <form className="grid gap-4" onSubmit={generateInvoice}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
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
        <Divider />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="grid gap-4">
            <DatePicker
              aria-label="Date"
              label="Date"
              value={date}
              onChange={(e: React.SetStateAction<DateValue | null>) => {
                setDate(e);
                setFormData({
                  ...formData,
                  invoiceDate: e!.toString(),
                });
              }}
            />
          </div>
          {/* Terms Selector */}
          <div className="grid gap-4">
            <Select
              aria-label="Terms"
              label="Terms"
              id="terms"
              selectedKeys={[term]}
              variant="bordered"
              onChange={(e) => {
                termSelection(e.target.value);
              }}
              isDisabled={!date}
            >
              {termPeriods.map((term) => (
                <SelectItem aria-label={term.label} key={term.key}>{term.label}</SelectItem>
              ))}
            </Select>
            {term && term !== "none" ? (
              <DatePicker
                aria-label="Date"
                label="Due Date"
                value={dueDate}
                onChange={(e: React.SetStateAction<DateValue | null>) => {
                  setDueDate(e);
                  setFormData({
                    ...formData,
                    invoiceDueDate: e!.toString(),
                  });
                }}
                isDisabled={term !== "custom"}
              />
            ) : null}
          </div>
        </div>
        {/* Invoice items */}
        {formData.items.map((item) => (
          <>
            <Divider />
            <div className="flex space-x-4" key={item.key}>
              <div className="flex-none gap-4">
                <Button
                  isIconOnly
                  aria-label="Delete"
                  color="danger"
                  isDisabled={formData.items.length === 1}
                  onPress={() => removeRow(Number(item.key))}
                >
                  <MdDelete size={24} />
                </Button>
              </div>
              <div className="flex-auto space-y-4 gap-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid gap-4">
                    <Input
                      aria-label="Description"
                      label="Description"
                      type="text"
                      value={item.description}
                      onChange={(e) => {
                        handleInputChange(e, Number(item.key), "description");
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-4">
                    <Input
                      aria-label="Rate"
                      label="Rate"
                      type="number"
                      value={String(item.unitPrice)}
                      onChange={(e) => {
                        handleInputChange(e, Number(item.key), "rate");
                      }}
                    />
                  </div>
                  <div className="grid gap-4">
                    <Input
                      aria-label="Quantity"
                      label="Quantity"
                      type="number"
                      value={String(item.quantity)}
                      onChange={(e) => {
                        handleInputChange(e, Number(item.key), "quantity");
                      }}
                    />
                  </div>
                  <div className="grid gap-4 justify-self-end self-center px-4">
                    €{item.total}.00
                  </div>
                </div>
              </div>
            </div>
            {/* <Divider /> */}
          </>
        ))}
        {/* Add invoice item button */}
        <div className="grid grid-cols-1 gap-4">
          <div className="grid gap-4">
            <Button
              isIconOnly
              aria-label="Add"
              color="default"
              onPress={addRow}
            >
              <MdAdd size={24} />
            </Button>
            <Divider />
          </div>
        </div>
        {/* Subtotals */}
        <div className="flex justify-end gap-4">
          <div className="gap-4">
            <p className="font-bold">Subtotal:</p>
            <p className="font-bold">Total:</p>
          </div>
          <div className="gap-4">
            <p>€{formData.subtotal}</p>
            {/* <p>€{formData.total}</p> */}
            <p>€{invoiceTotalCalculated}</p>
          </div>
        </div>
        <Divider />
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

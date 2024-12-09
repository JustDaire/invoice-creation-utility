import { Button } from "@nextui-org/button";
import React from "react";

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
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      {/* Main grid */}
      <div>
        {/*  onSubmit={handleSubmit} */}
        <form className="grid gap-4">
          <div className="grid grid-cols-2 gap-4 flex items-start">
            {/* Issuer details */}
            <div className="grid gap-4">
              <ul>
                <li>Company Name</li>
                <li>Company Email</li>
                <li>Company Phone</li>
                <li>Company Address</li>
                <li>Company VAT number</li>
              </ul>
            </div>
            {/* Client details */}
            <div className="grid gap-4">
              <ul>
                <li>Client Name</li>
                <li>Client Email</li>
                <li>Client Phone</li>
                <li>Client Address</li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {/* Invoice Number */}
            <div className="grid gap-4">Invoice Number</div>
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
              <table>
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Description</th>
                    <th>Rate</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <button>x</button>
                    </td>
                    <td>Item 1</td>
                    <td>1</td>
                    <td>100</td>
                    <td>100</td>
                  </tr>
                  <tr>
                    <td>
                      <button>x</button>
                    </td>
                    <td>Item 2</td>
                    <td>1</td>
                    <td>200</td>
                    <td>200</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Invoice notes */}
          <div className="grid grid-cols-1 gap-4">
            <div className="grid gap-4">Notes</div>
          </div>
          {/* Invoice actions */}
          <div className="grid grid-cols-1 gap-4">
            <div className="grid gap-4">
              <button type="submit">Generate</button>
              <button>Reset</button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

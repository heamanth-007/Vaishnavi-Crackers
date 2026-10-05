import mongoose, { Schema, Document } from 'mongoose';

export interface IEWayBill extends Document {
  ewayBillNo: string;
  ewayBillDate: string;
  generatedBy: string;
  validFrom: string;
  validUntil: string;
  portal: string;

  // Part - A
  supplierGstin: string;
  placeOfDispatch: string;
  recipientGstin: string;
  placeOfDelivery: string;
  documentNo: string;
  documentDate: string;
  transactionType: string;
  valueOfGoods: number | string;
  hsnCode: string;
  reasonForTransportation: string;
  transporter?: string;

  // Part - B
  mode: string;
  vehicleDocNo: string;
  fromPlace: string;
  enteredDate: string;
  enteredBy: string;
  cewbNo?: string;
  multiVehInfo?: string;
  partBPortal?: string;

  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const EWayBillSchema: Schema = new Schema(
  {
    ewayBillNo: { type: String, required: true, trim: true },
    ewayBillDate: { type: String, required: true, trim: true },
    generatedBy: { type: String, required: true, trim: true },
    validFrom: { type: String, required: true, trim: true },
    validUntil: { type: String, required: true, trim: true },
    portal: { type: String, default: '1', trim: true },

    // Part - A
    supplierGstin: { type: String, required: true, trim: true },
    placeOfDispatch: { type: String, required: true, trim: true },
    recipientGstin: { type: String, required: true, trim: true },
    placeOfDelivery: { type: String, required: true, trim: true },
    documentNo: { type: String, required: true, trim: true },
    documentDate: { type: String, required: true, trim: true },
    transactionType: { type: String, default: 'Regular', trim: true },
    valueOfGoods: { type: String, required: true, trim: true },
    hsnCode: { type: String, default: '3604 - FIRE WORKS', trim: true },
    reasonForTransportation: { type: String, default: 'Outward - Supply', trim: true },
    transporter: { type: String, default: '', trim: true },

    // Part - B
    mode: { type: String, default: 'Road', trim: true },
    vehicleDocNo: { type: String, default: '', trim: true },
    fromPlace: { type: String, default: '', trim: true },
    enteredDate: { type: String, default: '', trim: true },
    enteredBy: { type: String, default: '', trim: true },
    cewbNo: { type: String, default: '-', trim: true },
    multiVehInfo: { type: String, default: '-', trim: true },
    partBPortal: { type: String, default: '1', trim: true },

    notes: { type: String, default: '', trim: true },
  },
  {
    timestamps: true,
  }
);

export const EWayBill = mongoose.model<IEWayBill>('EWayBill', EWayBillSchema);
export default EWayBill;

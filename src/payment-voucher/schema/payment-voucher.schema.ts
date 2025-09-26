import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentVoucherDocument = PaymentVoucher & Document;

@Schema({ timestamps: true })
export class PaymentVoucher {
  @Prop({ required: true, unique: true })
  pvNumber: string;

  @Prop({ required: true })
  vendor: string;

  @Prop({ required: true })
  modeOfPayment: string;

  @Prop()
  invoiceNumber: string;

  @Prop({ required: true })
  paymentDate: Date;

  @Prop({ required: true })
  paymentType: string;

  @Prop({ required: true })
  partyType: string;

  @Prop({ required: true })
  party: string;

  @Prop({ required: true })
  partyName: string;

  @Prop({ required: true })
  accountPaidFrom: string;

  @Prop({ required: true })
  accountCurrency: string;

  @Prop({ required: true })
  accountBalance: number;

  @Prop([
    {
      accountHead: { type: String, required: true },
      taxRate: { type: String, required: true },
      amount: { type: Number, required: true },
      totalAmount: { type: Number, required: true },
    },
  ])
  advanceTaxesAndCharges: Array<{
    accountHead: string;
    taxRate: string;
    amount: number;
    totalAmount: number;
  }>;

  @Prop({ required: true })
  totalTaxesAndCharges: number;

  @Prop({ required: true })
  grandTotal: number;

  @Prop({ default: 'Draft' })
  status: string;

  @Prop()
  preparedBy: string;

  @Prop()
  checkedBy: string;

  @Prop()
  approvedBy: string;

  @Prop()
  remarks: string;

  @Prop()
  attachments: string[];

  @Prop({ required: true })
  createdBy: string;

  @Prop()
  updatedBy: string;
}

export const PaymentVoucherSchema =
  SchemaFactory.createForClass(PaymentVoucher);

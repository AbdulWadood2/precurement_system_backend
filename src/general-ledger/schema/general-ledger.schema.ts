import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GeneralLedgerDocument = GeneralLedger & Document;

@Schema({ timestamps: true })
export class GeneralLedger {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  account: string;

  @Prop({ required: true })
  accountNumber: string;

  @Prop({ required: true })
  accountName: string;

  @Prop({ default: 0 })
  debit: number;

  @Prop({ default: 0 })
  credit: number;

  @Prop({ required: true })
  balance: number;

  @Prop({ required: true })
  voucherType: string;

  @Prop()
  partyType: string;

  @Prop()
  voucherNo: string;

  @Prop()
  party: string;

  @Prop()
  referenceNo: string;

  @Prop()
  description: string;

  @Prop()
  remarks: string;

  @Prop({ required: true })
  company: string;

  @Prop()
  financeBook: string;

  @Prop()
  costCenter: string;

  @Prop()
  project: string;

  @Prop({ default: 'RM' })
  currency: string;

  @Prop({ default: 1 })
  exchangeRate: number;

  @Prop({ required: true })
  createdBy: string;

  @Prop()
  updatedBy: string;
}

export const GeneralLedgerSchema = SchemaFactory.createForClass(GeneralLedger);

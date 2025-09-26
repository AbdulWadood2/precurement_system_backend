import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChartOfAccountsDocument = ChartOfAccounts & Document;

@Schema({ timestamps: true })
export class ChartOfAccounts {
  @Prop({ required: true, unique: true })
  accountNumber: string;

  @Prop({ required: true })
  accountName: string;

  @Prop({ required: true })
  accountType: string;

  @Prop()
  parentAccount: string;

  @Prop({ required: true })
  rootType: string;

  @Prop({ required: true })
  company: string;

  @Prop({ default: 'RM' })
  accountCurrency: string;

  @Prop({ default: 0 })
  taxRate: number;

  @Prop()
  balanceMustBe: string;

  @Prop({ default: true })
  isEnabled: boolean;

  @Prop()
  description: string;

  @Prop()
  notes: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop()
  updatedBy: string;
}

export const ChartOfAccountsSchema =
  SchemaFactory.createForClass(ChartOfAccounts);

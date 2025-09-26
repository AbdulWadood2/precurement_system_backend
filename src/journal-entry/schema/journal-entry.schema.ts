import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JournalEntryDocument = JournalEntry & Document;

@Schema({ timestamps: true })
export class JournalEntry {
  @Prop({ required: true, unique: true })
  entryId: string;

  @Prop({ required: true })
  entryType: string;

  @Prop()
  title: string;

  @Prop()
  referenceNo: string;

  @Prop({ required: true })
  postingDate: Date;

  @Prop({ required: true })
  company: string;

  @Prop()
  financeBook: string;

  @Prop([
    {
      account: { type: String, required: true },
      partyType: { type: String },
      party: { type: String },
      debit: { type: Number, default: 0 },
      credit: { type: Number, default: 0 },
      description: { type: String },
    },
  ])
  accountingEntries: Array<{
    account: string;
    partyType?: string;
    party?: string;
    debit: number;
    credit: number;
    description?: string;
  }>;

  @Prop({ required: true })
  totalDebit: number;

  @Prop({ required: true })
  totalCredit: number;

  @Prop()
  userRemarks: string;

  @Prop()
  billNo: string;

  @Prop()
  referenceDate: Date;

  @Prop()
  billDate: Date;

  @Prop({ default: false })
  multiCurrency: boolean;

  @Prop()
  dueDate: Date;

  @Prop({ default: 'Draft' })
  status: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop()
  updatedBy: string;
}

export const JournalEntrySchema = SchemaFactory.createForClass(JournalEntry);

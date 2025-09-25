import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../roles/roles.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password_hash: string;

  @Prop({ required: true })
  display_name: string;

  @Prop({ default: null })
  country_code?: string;

  @Prop({ default: null })
  native_language_id?: string;

  @Prop({ default: null })
  ui_language_id?: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Prop({ default: [] })
  refreshToken: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create indexes for efficient querying
UserSchema.index({ native_language_id: 1 });
UserSchema.index({ ui_language_id: 1 });

import { Module } from '@nestjs/common';
import { JournalEntryController } from './journal-entry.controller';
import { JournalEntryService } from './journal-entry.service';
import { JournalEntryHelper } from './helper/journal-entry.helper';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JournalEntry,
  JournalEntrySchema,
} from './schema/journal-entry.schema';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JournalEntry.name, schema: JournalEntrySchema },
    ]),
    UserModule,
    AuthModule,
  ],
  controllers: [JournalEntryController],
  providers: [
    { provide: 'IJournalEntryService', useClass: JournalEntryService },
    { provide: 'IJournalEntryHelper', useClass: JournalEntryHelper },
  ],
  exports: [
    { provide: 'IJournalEntryService', useClass: JournalEntryService },
    { provide: 'IJournalEntryHelper', useClass: JournalEntryHelper },
  ],
})
export class JournalEntryModule {}

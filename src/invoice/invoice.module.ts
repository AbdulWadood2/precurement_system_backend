import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './schema/invoice.schema';
import { InvoiceHelper } from './helper/invoice.helper';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    UserModule,
    AuthModule,
  ],
  providers: [
    { provide: 'IInvoiceHelper', useClass: InvoiceHelper },
    { provide: 'IInvoiceService', useClass: InvoiceService },
  ],
  controllers: [InvoiceController],
  exports: [
    { provide: 'IInvoiceHelper', useClass: InvoiceHelper },
    { provide: 'IInvoiceService', useClass: InvoiceService },
  ],
})
export class InvoiceModule {}

import { Controller, Inject } from '@nestjs/common';
import { IS3Service } from './interfaces/S3.services.interfaces';

@Controller('S3')
export class S3Controller {
  constructor(
    @Inject('IS3Service')
    private readonly S3Service: IS3Service,
  ) {}
}

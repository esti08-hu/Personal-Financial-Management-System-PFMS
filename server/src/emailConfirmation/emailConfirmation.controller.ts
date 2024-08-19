import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { EmailConfirmationService } from './emailConfirmation.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/guards/auth.decorators';

@Controller('email-confirmation')
@ApiBearerAuth()
@ApiTags('email-confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('resend-confirmation-link')
  async resendConfirmationLink(@Req() request) {
    await this.emailConfirmationService.resendConfirmationLink(
      request.user.pid,
    );
  }

  @Get('confirm')
  async confirm(@Query('token') token: string) {
    const email =
      await this.emailConfirmationService.decodeConfirmationToken(token);
    await this.emailConfirmationService.confirmEmail(email);
    return { message: 'Email confirmed successfully!' };
  }
}
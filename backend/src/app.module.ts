import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestsService } from './requests/requests.service';
import { RequestsController } from './requests/requests.controller';

@Module({
  imports: [HttpModule],
  controllers: [AppController, RequestsController],
  providers: [AppService, RequestsService],
})
export class AppModule {}

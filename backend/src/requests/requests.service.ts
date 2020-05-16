import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class RequestsService {
  constructor(private httpService: HttpService) {}

  async proxy(url: string) {
    if (url && url.length > 0) {
      const response = await this.httpService.get(url).toPromise();
      return response.data;
    } else {
      return {err: "no url"}
    }
  }

}

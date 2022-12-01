import { HttpClient } from "@angular/common/http";
import { Component } from '@angular/core';
import { firstValueFrom } from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    private httpClient: HttpClient
  ) {}

  async makeRequest() {
    // This is a URL used in a request in our production app.
    const url =
      'https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyFeedSample/MapServer?f=json';

    const result = await firstValueFrom(this.httpClient.get(url));

    console.dir(result);
  }
}

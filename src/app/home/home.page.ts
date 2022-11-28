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

  async requestWithEncodedSpace() {
    // URL with an encoded space (via the `+` character) works as expected.
    const url = 'https://swapi.dev/api/people/?search=r2+d2';

    await this.makeRequest(url);
  }

  async requestWithoutEncodedSpace() {
    // URL with a non-encoded space fails on hybrid iOS.
    const url = 'https://swapi.dev/api/people/?search=r2 d2';

    await this.makeRequest(url);
  }

  private async makeRequest(url: string) {
    const result = await firstValueFrom(this.httpClient.get(url));

    console.dir(result);
  }
}

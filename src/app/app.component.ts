import { HttpClient } from "@angular/common/http";
import { Component } from '@angular/core';
import { firstValueFrom } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private httpClient: HttpClient) {}

  async ngOnInit() {
    // URL with an encoded space (via the `+` character) works as expected.
    // const url = 'https://swapi.dev/api/people/?search=r2+d2';

    // URL with a non-encoded space fails.
    // Works fine without `CapacitorHttp`.
    const url = 'https://swapi.dev/api/people/?search=r2 d2';

    const result = await firstValueFrom(this.httpClient.get(url));

    console.dir(result);
  }
}

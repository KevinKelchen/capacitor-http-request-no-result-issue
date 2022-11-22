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
    const result = await firstValueFrom(this.httpClient.get('https://swapi.dev/api/people/?search=r2+d2'));
    console.dir(result);
  }
}

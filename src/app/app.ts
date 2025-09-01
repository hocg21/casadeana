import { Component, inject, LOCALE_ID, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import localeMx from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
import { MatIconRegistry } from '@angular/material/icon';
registerLocaleData(localeMx)

@Component({
    selector: 'app-root',
    standalone:true,
    imports: [RouterOutlet],
    templateUrl: './app.html',
    styleUrls: ['./app.css'],
    providers: [
        { provide: LOCALE_ID, useValue: 'es-MX' }
    ]
},)
export class App implements OnInit{
  private iconRegistry = inject(MatIconRegistry);
  protected title = 'nenyden';

  ngOnInit(): void {
    this.iconRegistry.setDefaultFontSetClass(...['material-symbols-outlined'])

  }
}

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [RouterModule, TranslocoModule],
  templateUrl: './home-hero.component.html',
})
export class HomeHeroComponent {}

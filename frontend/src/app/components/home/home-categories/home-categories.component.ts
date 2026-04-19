import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Category } from '@models';

@Component({
  selector: 'app-home-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule],
  templateUrl: './home-categories.component.html',
})
export class HomeCategoriesComponent {
  @Input() categories: Category[] = [];
}

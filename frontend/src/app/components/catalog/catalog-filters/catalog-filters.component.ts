import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { Category } from '@models';

@Component({
  selector: 'app-catalog-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule],
  templateUrl: './catalog-filters.component.html',
})
export class CatalogFiltersComponent {
  @Input() categories: Category[] = [];
  @Input() selectedCategory = '';
  @Input() searchQuery = '';
  @Input() sortBy = 'newest';
  @Input() totalCount = 0;

  @Output() categoryChange = new EventEmitter<string>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<string>();

  onSearchKeyup(event: KeyboardEvent, value: string): void {
    if (event.key === 'Enter') {
      this.searchChange.emit(value);
    }
  }
}

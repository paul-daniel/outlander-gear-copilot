import { Injectable } from '@angular/core';

const THEME_KEY = 'outlander-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _isDark = true;

  get isDark(): boolean {
    return this._isDark;
  }

  constructor() {
    const stored = localStorage.getItem(THEME_KEY);
    this._isDark = stored ? stored === 'dark' : true;
    this.applyTheme();
  }

  toggle(): void {
    this._isDark = !this._isDark;
    localStorage.setItem(THEME_KEY, this._isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this._isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}

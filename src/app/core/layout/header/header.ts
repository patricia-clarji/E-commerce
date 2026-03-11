import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

import { AuthService } from '../../auth/auth';
import { CartService } from '../../../shared/services/cart';
import { ThemeService } from '../../../shared/services/theme.service';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterModule,
    RouterLinkActive,
    ClickOutsideDirective,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly auth = inject(AuthService);
  readonly cart = inject(CartService);
  readonly theme = inject(ThemeService);

  readonly menuOpen = signal(false);
  readonly scrolled = signal(false);


  readonly search = signal('');

  
  readonly cartCount = computed(() => this.cart.count());

  constructor() {
    if (this.isBrowser) {
      const onScroll = () => this.scrolled.set((window.scrollY ?? 0) > 8);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
    }

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.menuOpen.set(false));
  }

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  logout() {
    this.closeMenu();
    this.auth.logout(true);
  }
  toggleTheme() {
    this.theme.toggle();
  }

  submitSearch() {
    const q = this.search().trim();
    this.router.navigate(['/products'], { queryParams: q ? { q } : {} });
    this.closeMenu();
  }
}

import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ProductsService } from '../../shared/services/products';
import { ProductCard } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private readonly route = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);

  readonly q = signal('');
  readonly category = signal<string>('All');

  readonly products = computed(() => this.productsService.items());

  readonly categories = computed(() => {
    const set = new Set<string>();
    for (const p of this.products()) set.add(p.category);
    return ['All', ...Array.from(set).sort()];
  });

  readonly filtered = computed(() => {
    const q = this.q().trim().toLowerCase();
    const c = this.category();

    return this.products().filter((p) => {
      const matchesQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      const matchesC = c === 'All' || p.category === c;

      return matchesQ && matchesC;
    });
  });

  constructor() {
    // ✅ sync query param ?q=...
    effect(() => {
      const qp = this.route.snapshot.queryParamMap.get('q') ?? '';
      this.q.set(qp);
    });

    // ✅ also update when navigation changes (real-time)
    this.route.queryParamMap.subscribe((m) => {
      this.q.set(m.get('q') ?? '');
    });
  }
}
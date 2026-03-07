import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsService } from '../../../shared/services/products';
import { CartService } from '../../../shared/services/cart';
import { OrdersService } from '../../../shared/services/order';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  readonly totalProducts = computed(() => this.products.items().length);

  readonly totalStock = computed(() =>
    this.products.items().reduce((s, p) => s + (p.stock ?? 0), 0)
  );

  readonly lowStockCount = computed(() =>
    this.products.items().filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 10).length
  );

  readonly outOfStockCount = computed(() =>
    this.products.items().filter((p) => (p.stock ?? 0) === 0).length
  );

  readonly totalInventoryValue = computed(() =>
    this.products.items().reduce((sum, p) => sum + p.price * (p.stock ?? 0), 0)
  );

  readonly totalOrders = computed(() => this.orders.orders().length);

  readonly paidOrders = computed(() =>
    this.orders.orders().filter((o) => o.status === 'Paid' || o.status === 'Completed').length
  );

  readonly revenue = computed(() =>
    this.orders.orders()
      .filter((o) => o.status === 'Paid' || o.status === 'Completed')
      .reduce((sum, o) => sum + o.total, 0)
  );

  readonly recentProducts = computed(() => this.products.items().slice(0, 6));

  readonly lowStockProducts = computed(() =>
    this.products.items()
      .filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 10)
      .slice(0, 6)
  );

  readonly topProductsByValue = computed(() =>
    [...this.products.items()]
      .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
      .slice(0, 5)
  );

  readonly cartCount = computed(() => this.cart.count());

  constructor(
    public products: ProductsService,
    public cart: CartService,
    public orders: OrdersService
  ) {}
}
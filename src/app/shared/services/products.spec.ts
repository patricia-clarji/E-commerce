import { TestBed } from '@angular/core/testing';
import { ProductsService } from './products';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsService);
  });

  it('creates a product and it appears in list', () => {
    const before = service.items().length;

    service.addProduct({
      name: 'Test Item',
      brand: 'Test Brand',
      category: 'Tech', 
      price: 10,
      stock: 5,
      images: ['https://picsum.photos/seed/test/600/600'],
      shortDescription: 'Short test description',
      description: 'Longer test description that is valid',
      rating: 4.5,
      reviewsCount: 10,
    });

    const after = service.items().length;
    expect(after).toBe(before + 1);
  });
});
import { getDiscount, getStars } from './product.utils';

describe('product.utils', () => {
  describe('getDiscount', () => {
    it('should return 0 when compare_price is null', () => {
      expect(getDiscount({ price: 100, compare_price: null })).toBe(0);
    });

    it('should return 0 when compare_price is undefined', () => {
      expect(getDiscount({ price: 100 })).toBe(0);
    });

    it('should calculate correct discount percentage', () => {
      expect(getDiscount({ price: 80, compare_price: 100 })).toBe(20);
    });

    it('should round the discount percentage', () => {
      expect(getDiscount({ price: 70, compare_price: 99 })).toBe(29);
    });

    it('should return 0 when compare_price is 0', () => {
      expect(getDiscount({ price: 50, compare_price: 0 })).toBe(0);
    });
  });

  describe('getStars', () => {
    it('should return 5 filled stars for rating 5', () => {
      expect(getStars(5)).toEqual([1, 1, 1, 1, 1]);
    });

    it('should return 0 filled stars for rating 0', () => {
      expect(getStars(0)).toEqual([0, 0, 0, 0, 0]);
    });

    it('should return 3 filled stars for rating 3', () => {
      expect(getStars(3)).toEqual([1, 1, 1, 0, 0]);
    });

    it('should round up at 0.5', () => {
      expect(getStars(3.5)).toEqual([1, 1, 1, 1, 0]);
    });

    it('should round down below 0.5', () => {
      expect(getStars(3.4)).toEqual([1, 1, 1, 0, 0]);
    });
  });
});

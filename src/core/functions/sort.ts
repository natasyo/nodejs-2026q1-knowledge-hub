import { Order, SortOrderDto } from '../../modules/dto/sort-order.dto';

export function sortArray<T extends object>(
  array: Array<T>,
  sortBy: string = 'id',
  order: Order = Order.ASC,
) {
  return [...array].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (aVal == null) return 1;
    if (bVal == null) return -1;

    let result: number;

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      result = aVal - bVal;
    } else if (aVal instanceof Date && bVal instanceof Date) {
      result = aVal.getTime() - bVal.getTime();
    } else {
      result = String(aVal).localeCompare(String(bVal));
    }

    return order === Order.DESC ? -result : result;
  });
}

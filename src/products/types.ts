type SortVariant = {
  name: string;
  value: number;
  direction: 'ASC' | 'DESC';
};

export const sortVariants: SortVariant[] = [
  {
    name: 'product.price',
    value: 0,
    direction: 'DESC',
  },
  {
    name: 'product.price',
    value: 1,
    direction: 'ASC',
  },
  {
    name: 'product.price',
    value: 2,
    direction: 'DESC',
  },
  {
    name: 'product.date',
    value: 3,
    direction: 'DESC',
  },
];

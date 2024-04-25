import { Tag } from 'src/tags/entities/tag.entity';

export class GetReviewDto {
  id: number;
  composition: {
    name: string;
    tag: Tag;
  };
  text: string;
  userRating: number;
  avgRating: number;
  title: string;
  author: {
    id: number;
    name: string;
  };
  date: string;
  group: Tag;
  tags: Tag[];

  isLiked: boolean;

  constructor() {
    this.date = '';
  }
}

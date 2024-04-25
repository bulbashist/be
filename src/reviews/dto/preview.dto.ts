import { Tag } from 'src/tags/entities/tag.entity';
import { Review } from '../entities/review.entity';

export class Preview {
  id: number;
  title: string;
  date: Date;
  compositionName: string;
  avgRating: number;
  tags: Tag[];
  previewImg: string;

  constructor(review: Review) {
    this.id = review.id;
    this.title = review.title;
    this.date = review.date;

    this.previewImg = review.previewImg;
  }
}

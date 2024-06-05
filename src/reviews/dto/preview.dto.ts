import { Review } from '../entities/review.entity';

export class Preview {
  id: number;
  title: string;
  date: Date;
  compositionName: string;
  avgRating: number;

  previewImg: string;

  constructor(review: Review) {
    this.id = review.id;
    this.title = review.title;
    this.date = review.date;

    this.previewImg = review.previewImg;
  }
}

import { Comment } from '../entities/comment.entity';

type Author = {
  id: number;
  name: string;
};

export class GetCommentDto {
  constructor(comment: Comment) {
    this.id = comment.id;
    this.date = comment.date;
    this.text = comment.text;
    this.user = {
      id: comment.user.id,
      name: comment.user.name,
    };
  }

  id: number;
  text: string;
  date: Date;
  user: Author;
}

export class CreateCommentDto {
  product: {
    id: number;
  };
  user: {
    id: number;
  };
  text: string;
  rating: number;
}

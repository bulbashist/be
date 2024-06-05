export class CreateReviewDto {
  user?: {
    id: number;
  };

  composition: {
    id: number;
  };
  previewImg: string;
  title: string;
  text: string;
}

export type CreateRepoReviewDto = CreateReviewDto & { user: { id: number } };

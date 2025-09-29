export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface PostTag {
  tag_id: string;
  tags: Tag;
}

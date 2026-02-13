export interface Tag {
  id: string;
  name: string;
  group: string;
}

export interface TagsGroup {
  group: string;
  name: string;
  tags: Tag[];
}

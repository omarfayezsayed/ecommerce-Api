export interface CategoryQuery {
  existsById(id: string): Promise<boolean>;
}

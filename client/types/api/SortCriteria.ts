export enum OrderByEnum {
  ASC = 1,
  DESC = 2,
}

export type SortCriteria<T = string> = {
  sort?: {
    orderColumn: T extends string ? string : keyof T;
    orderBy: OrderByEnum;
  };
};

export type ICategory = {
  id?: string;
  name: string;
  icon: string;
  type: "INCOME" | "EXPENSE";
  color: string;
};
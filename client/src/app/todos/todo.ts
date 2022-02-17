export interface ToDo {
  _id: string;
  status: ToDoStatus;
  owner: string;
  body: string;
  category: string;
}

export type ToDoStatus = 'complete' | 'incomplete';

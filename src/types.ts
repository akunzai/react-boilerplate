export type Priority = 'low' | 'medium' | 'high';

export class Todo {
  constructor(
    public id: number,
    public title: string,
    public description?: string,
    public done = false,
    public priority: Priority = 'medium',
    public tags: string[] = [],
    public category?: string,
    public dueDate?: string
  ) {}
}

export type User = {
  name: string;
  email: string;
  avatarUrl?: string;
};

export type Category = {
  value: string;
  label: string;
  children?: Category[];
};

export const categories: Category[] = [
  {
    value: 'work',
    label: 'Work',
    children: [
      { value: 'work/meetings', label: 'Meetings' },
      {
        value: 'work/projects',
        label: 'Projects',
        children: [
          { value: 'work/projects/alpha', label: 'Alpha' },
          { value: 'work/projects/beta', label: 'Beta' },
        ],
      },
    ],
  },
  {
    value: 'personal',
    label: 'Personal',
    children: [
      { value: 'personal/errands', label: 'Errands' },
      { value: 'personal/health', label: 'Health' },
    ],
  },
];

export const allTags = ['urgent', 'home', 'finance', 'reading', 'shopping'];

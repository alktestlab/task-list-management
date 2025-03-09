export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export type TaskFormData = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

export const TASK_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export const TASK_PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'warning.main';
    case 'in-progress':
      return 'info.main';
    case 'completed':
      return 'success.main';
    default:
      return 'text.primary';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'low':
      return 'success.main';
    case 'medium':
      return 'warning.main';
    case 'high':
      return 'error.main';
    default:
      return 'text.primary';
  }
};

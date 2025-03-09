import React from 'react';
import { Card, CardContent, Typography, Chip, IconButton, Box, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task, getStatusColor, getPriorityColor } from '@/types/task';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent>
        <Box className="flex justify-between items-start">
          <Typography variant="h6" component="h3" className="font-medium">
            {task.title}
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton size="small" onClick={() => onEdit(task)} aria-label="edit task">
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(task.id)} aria-label="delete task">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
        
        {task.description && (
          <Typography variant="body2" color="text.secondary" className="mt-2 mb-3">
            {task.description}
          </Typography>
        )}
        
        <Box className="flex flex-wrap gap-2 mt-3">
          <Chip 
            label={task.status.charAt(0).toUpperCase() + task.status.slice(1)} 
            size="small" 
            sx={{ bgcolor: getStatusColor(task.status) + '20', color: getStatusColor(task.status) }}
          />
          <Chip 
            label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} 
            size="small" 
            sx={{ bgcolor: getPriorityColor(task.priority) + '20', color: getPriorityColor(task.priority) }}
          />
          <Typography variant="caption" color="text.secondary" className="ml-auto">
            {new Date(task.updatedAt).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskItem;

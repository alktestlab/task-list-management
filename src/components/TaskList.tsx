import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, CircularProgress, Alert, TextField, MenuItem, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TaskItem from './TaskItem';
import { Task, TASK_STATUS_OPTIONS } from '@/types/task';

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

const TaskList = forwardRef<{ fetchTasks: () => Promise<void> }, TaskListProps>(
  ({ onEditTask }, ref) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const fetchTasks = async () => {
      setLoading(true);
      try {
        let url = '/api/tasks';
        const params = new URLSearchParams();
        
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        if (statusFilter) {
          params.append('status', statusFilter);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        
        const data = await response.json();
        setTasks(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Expose fetchTasks method to parent component through ref
    useImperativeHandle(ref, () => ({
      fetchTasks
    }));

    useEffect(() => {
      fetchTasks();
    }, [searchQuery, statusFilter]);

    const handleDeleteTask = async (taskId: number) => {
      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete task');
        }
        
        // Refresh the task list
        fetchTasks();
      } catch (err) {
        console.error('Error deleting task:', err);
        setError('Failed to delete task. Please try again later.');
      }
    };

    return (
      <Box>
        <Box className="mb-6 flex flex-col gap-4 sm:flex-row">
          <TextField
            label="Search tasks"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            className="flex-1"
          />
          
          <TextField
            select
            label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            variant="outlined"
            className="sm:w-48"
          >
            <MenuItem value="">All</MenuItem>
            {TASK_STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
        
        {loading ? (
          <Box className="flex justify-center my-8">
            <CircularProgress />
          </Box>
        ) : tasks.length === 0 ? (
          <Typography variant="body1" className="text-center my-8 text-gray-500">
            No tasks found. Create a new task to get started.
          </Typography>
        ) : (
          <Box>
            {tasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onEdit={onEditTask} 
                onDelete={handleDeleteTask} 
              />
            ))}
          </Box>
        )}
      </Box>
    );
  }
);

export default TaskList;

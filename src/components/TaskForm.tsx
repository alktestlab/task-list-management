import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  SelectChangeEvent
} from '@mui/material';
import { Task, TaskFormData, TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from '@/types/task';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: TaskFormData) => Promise<void>;
  initialData?: Task;
  isEditing: boolean;
}

const defaultFormData: TaskFormData = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium'
};

const TaskForm: React.FC<TaskFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  initialData, 
  isEditing 
}) => {
  const [formData, setFormData] = useState<TaskFormData>(defaultFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        status: initialData.status as 'pending' | 'in-progress' | 'completed',
        priority: initialData.priority as 'low' | 'medium' | 'high'
      });
    } else {
      setFormData(defaultFormData);
    }
    setErrors({});
  }, [initialData, open]);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error when field is edited
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Task' : 'Create New Task'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box className="space-y-4">
            <TextField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleTextFieldChange}
              fullWidth
              required
              error={!!errors.title}
              helperText={errors.title}
              autoFocus
            />
            
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleTextFieldChange}
              fullWidth
              multiline
              rows={3}
            />
            
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  label="Status"
                >
                  {TASK_STATUS_OPTIONS.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  name="priority"
                  value={formData.priority}
                  onChange={handleSelectChange}
                  label="Priority"
                >
                  {TASK_PRIORITY_OPTIONS.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;

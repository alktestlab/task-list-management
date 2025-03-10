'use client';

import React, { useState, useRef } from 'react';
import { Container, Typography, Button, Box, AppBar, Toolbar, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import ThemeToggle from '@/components/ThemeToggle';
import { Task, TaskFormData } from '@/types/task';

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const taskListRef = useRef<{ fetchTasks: () => Promise<void> } | null>(null);

  const handleOpenForm = () => {
    setIsFormOpen(true);
    setIsEditing(false);
    setCurrentTask(undefined);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleCreateTask = async (taskData: TaskFormData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      
      // Refresh the task list after creating a task
      if (taskListRef.current) {
        await taskListRef.current.fetchTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const handleUpdateTask = async (taskData: TaskFormData) => {
    if (!currentTask) return;

    try {
      const response = await fetch(`/api/tasks/${currentTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      // Refresh the task list after updating a task
      if (taskListRef.current) {
        await taskListRef.current.fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const handleSubmitTask = async (taskData: TaskFormData) => {
    if (isEditing && currentTask) {
      await handleUpdateTask(taskData);
    } else {
      await handleCreateTask(taskData);
    }
  };

  return (
    <>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="h1" className="flex-grow">
            Task List Management
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" className="py-8">
        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h4" component="h2" className="font-medium">
            Tasks
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleOpenForm}
          >
            Add Task
          </Button>
        </Box>

        <Paper elevation={2} className="p-6">
          <TaskList 
            onEditTask={handleEditTask} 
            ref={taskListRef}
          />
        </Paper>

        <TaskForm 
          open={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmitTask}
          initialData={currentTask}
          isEditing={isEditing}
        />
      </Container>
    </>
  );
}

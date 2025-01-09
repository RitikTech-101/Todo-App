// src/components/TaskList.tsx
import React from 'react';
import { Box, List, ListItem, Button } from '@chakra-ui/react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import TaskItem from './TaskItem';
import { Task } from '../App';
import { User } from 'firebase/auth';

interface TaskListProps {
  tasks: Task[];
  fetchTasks: (userId: string) => void;
  user: User;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, fetchTasks, user }) => {
  const deleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, 'tasks', taskId));
    fetchTasks(user.uid);
  };

  return (
    <Box mt={4}>
      <List>
        {tasks.map((task) => (
          <ListItem key={task.id} mb={4}>
            <TaskItem task={task} deleteTask={deleteTask} fetchTasks={fetchTasks} user={user} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TaskList;

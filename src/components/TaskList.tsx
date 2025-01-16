import React from 'react';
import { Box, List, ListItem } from '@chakra-ui/react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import TaskItem from './TaskItem';
import { Task } from '../App';

interface TaskListProps {
  tasks: Task[];
  fetchTasks: (userId: string) => void;
  userId: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, fetchTasks, userId }) => {
  const deleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, 'tasks', taskId));
    fetchTasks(userId);
  };

  return (
    <Box mt={4}>
      <List>
        {tasks.map((task) => (
          <ListItem key={task.id} mb={4}>
            <TaskItem task={task} deleteTask={deleteTask} fetchTasks={fetchTasks} userId={userId} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TaskList;

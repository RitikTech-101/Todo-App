// src/components/TaskItem.tsx
import React, { useState } from 'react';
import { Box, Text, Button, Input } from '@chakra-ui/react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Task } from '../App';
import { User } from 'firebase/auth';

interface TaskItemProps {
  task: Task;
  deleteTask: (taskId: string) => void;
  fetchTasks: (userId: string) => void;
  user: User;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, deleteTask, fetchTasks, user }) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [newTaskName, setNewTaskName] = useState<string>(task.taskName);

  const saveTaskName = async () => {
    await updateDoc(doc(db, 'tasks', task.id), { taskName: newTaskName });
    setEditing(false);
    fetchTasks(task.userId);
  };

  return (
    <Box>
      {editing ? (
        <>
          <Input
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="Edit task name"
          />
          <Button onClick={saveTaskName} colorScheme="blue" size="sm" ml={2}>
            Save
          </Button>
        </>
      ) : (
        <>
          <Text>{task.taskName}</Text>
          <Button onClick={() => setEditing(true)} colorScheme="yellow" size="sm" ml={2}>
            Edit
          </Button>
          <Button onClick={() => deleteTask(task.id)} colorScheme="red" size="sm" ml={2}>
            Delete
          </Button>
        </>
      )}

      <Box mt={2}>
        {task.subTasks?.map((subTask, index) => (
          <Box key={index} ml={4}>
            <Text>{subTask.name}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TaskItem;

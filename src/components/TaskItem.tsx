import React, { useState } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import { Task } from '../App';
import EditTaskForm from './EditTaskForm';

interface TaskItemProps {
  task: Task;
  deleteTask: (taskId: string) => void;
  fetchTasks: (userId: string) => void;
  userId: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, deleteTask, fetchTasks, userId }) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => setIsEditing(!isEditing);

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" mb={4} >
      <Text fontSize="xl" >{task.taskName}</Text>
      <Text fontSize="md" color="gray.500" >
        {task.subTasks.length} Sub-tasks
      </Text>
      <Button colorScheme="blue" onClick={toggleEditing} mt={3} borderRadius={20}>
        Edit
      </Button>
      <Button colorScheme="red" onClick={() => deleteTask(task.id)} mt={3} ml={3} borderRadius={20}>
        Delete
      </Button>

      {isEditing && (
        <EditTaskForm task={task} onClose={toggleEditing} fetchTasks={fetchTasks} userId={userId} />
      )}
    </Box>
  );
};

export default TaskItem;

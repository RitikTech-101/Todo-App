import React, { useEffect } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { Input, Button, Box, Flex } from '@chakra-ui/react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Task, SubTask } from '../App';

interface EditTaskFormProps {
  task: Task;
  onClose: () => void;
  fetchTasks: (userId: string) => void;
  userId: string;
}

interface TaskFormData {
  taskName: string;
  subTasks: SubTask[];
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ task, onClose, fetchTasks, userId }) => {
  const { control, handleSubmit, register, setValue } = useForm<TaskFormData>({
    defaultValues: {
      taskName: task.taskName,
      subTasks: task.subTasks,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subTasks',
  });

  
  useEffect(() => {
    setValue('taskName', task.taskName);
    setValue('subTasks', task.subTasks);
  }, [task, setValue]);

  const onSubmit: SubmitHandler<TaskFormData> = async (data) => {
    const updatedTask = {
      taskName: data.taskName,
      subTasks: data.subTasks,
    };

    
    await updateDoc(doc(db, 'tasks', task.id), updatedTask);

    fetchTasks(userId);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} >
      <Flex justifyContent="space-between" alignItems="center" mb={4} fontSize="lg">
        <Input {...register('taskName')} placeholder="Task Name" flex="1" pl={140}  />
        <Button type="submit" colorScheme="green" ml={4} fontSize={15} >
          Update Task
        </Button>
      </Flex>

      
      {fields.map((field, index) => (
        <Box key={field.id} mb={4}>
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Input
              {...register(`subTasks.${index}.name` as const)}
              placeholder="Sub-task Name"
              flex="1"
              pl={120}
            />
            <Button
              type="button"
              onClick={() => append({ name: '', status: 'Pending' })}
              colorScheme="blue"
              size="sm"
              ml={2}
              fontSize={15}
            >
              Add Sub-task
            </Button>
          </Flex>

          <Button
            type="button"
            onClick={() => remove(index)}
            colorScheme="red"
            size="sm"
            width="35%"
            ml={77}
            fontSize={15}
          >
            Remove Sub-task
          </Button>
        </Box>
      ))}
    </form>
  );
};

export default EditTaskForm;

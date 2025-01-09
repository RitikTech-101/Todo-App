// src/components/AddTaskForm.tsx
import React, { useState } from 'react';
import { useForm, useFieldArray, SubmitHandler, FieldValues } from 'react-hook-form';
import { Input, Button, Box } from '@chakra-ui/react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from 'firebase/auth';

// Sub-task type
interface SubTask {
  name: string;
  status: string;
}

// Form data type
interface TaskFormData {
  taskName: string;
  subTasks: SubTask[];
}

interface AddTaskFormProps {
  fetchTasks: (userId: string) => void;
  user: User;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ fetchTasks, user }) => {
  const { control, handleSubmit, register } = useForm<TaskFormData>({
    defaultValues: {
      taskName: '',
      subTasks: [{ name: '', status: 'Pending' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subTasks',
  });

  const onSubmit: SubmitHandler<TaskFormData> = async (data) => {
    const newTask = {
      taskName: data.taskName,
      status: 'Pending',
      subTasks: data.subTasks,
      createdAt: new Date(),
      userId: user.uid,
      username: user.displayName,
    };
    await addDoc(collection(db, 'tasks'), newTask);
    fetchTasks(user.uid);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('taskName')} placeholder="Task Name" mb={4} />
      {fields.map((field, index) => (
        <Box key={field.id} mb={2}>
          <Input {...register(`subTasks[${index}].name`)} placeholder="Sub-task Name" />
          <Button type="button" onClick={() => remove(index)} colorScheme="red" size="sm" ml={2}>
            Remove Sub-task
          </Button>
        </Box>
      ))}
      <Button type="button" onClick={() => append({ name: '', status: 'Pending' })} colorScheme="blue" size="sm">
        Add Sub-task
      </Button>
      <Button type="submit" colorScheme="green" mt={4}>
        Add Task
      </Button>
    </form>
  );
};

export default AddTaskForm;

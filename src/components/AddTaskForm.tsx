import React from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { Input, Button, Box, Flex, VStack, Container, useColorMode } from '@chakra-ui/react';
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

  const { colorMode } = useColorMode(); 

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
    <Box
      w="100%"
      h="100%"
      bg={colorMode === 'dark' ? 'gray.800' : 'gray.100'} 
      display="flex"
      justifyContent="center"
      alignItems="center"
      // padding={4}
        borderRadius={70}
    >
      <Container
        maxW="lg"
        bg={colorMode === 'dark' ? 'blue.800' : '#f3a5f3'} //
        borderRadius="lg"
        shadow="lg"
        p={6}
        h="auto" 
        overflowY="auto" 
      >
        {/* Form title */}
        <VStack spacing={5} align="stretch">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex justifyContent="center" alignItems="center" mb={4}>
              <Input
                {...register('taskName')}
                placeholder="Task Name"
                flex="1"
                m={3} 
                color={colorMode === 'dark' ? 'white' : 'gray.600'}
                bg={colorMode === 'dark' ? 'blue.600' : 'white'} //
              
              />
              <Button type="submit" colorScheme="green" m={3} borderRadius={20}>
                Add Task
              </Button>
            </Flex>

           
            {fields.map((field, index) => (
              <Box key={field.id} mb={4}>
                <Flex justifyContent="center" alignItems="center" mb={2}>
                  <Input
                    {...register(`subTasks.${index}.name` as const)}
                    placeholder="Sub-task Name"
                    flex="1"
                    m={3} 
                    bg={colorMode === 'dark' ? 'blue.600' : 'white'} 
                    color={colorMode === 'dark' ? 'white' : 'black'} 
                  />
                  <Button
                    type="button"
                    onClick={() => append({ name: '', status: 'Pending' })}
                    colorScheme="blue"
                    size="sm"
                    m={3} 
                    borderRadius={10}
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
                  ml="auto" 
                  display="block"
                  borderRadius={15}
                >
                  Remove Sub-task
                </Button>
              </Box>
            ))}
          </form>
        </VStack>
      </Container>
    </Box>
  );
};

export default AddTaskForm;

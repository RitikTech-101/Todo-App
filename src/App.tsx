// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { auth, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';

// Task type definition
export interface SubTask {
  name: string;
  status: string;
}

export interface Task {
  id: string;
  taskName: string;
  status: string;
  subTasks: SubTask[];
  createdAt: any;
  userId: string;
  username: string;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) fetchTasks(user.uid);
    });
    return () => unsubscribe();
  }, []);

  // Fetch tasks for the user
  const fetchTasks = async (userId: string) => {
    const querySnapshot = await getDocs(collection(db, 'tasks'));
    const tasksData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[];
    setTasks(tasksData.filter((task) => task.userId === userId));
  };

  return (
    <Box p={5}>
      {user ? (
        <>
          <Text fontSize="xl">Welcome, {user.displayName}</Text>
          <AddTaskForm fetchTasks={fetchTasks} user={user} />
          <TaskList tasks={tasks} fetchTasks={fetchTasks} user={user} />
        </>
      ) : (
        <Text>Please sign in</Text>
      )}
    </Box>
  );
};

export default App;

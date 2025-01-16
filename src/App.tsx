import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, Container, Button, Heading, Divider, Spinner, FormControl, FormLabel, Input, FormErrorMessage, Stack, Center, Select, useColorMode } from '@chakra-ui/react';
import { auth, db, messaging } from './firebase';
import { onAuthStateChanged, User, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, getDocs, query, where, addDoc, DocumentData } from 'firebase/firestore';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import ThemeToggler from './components/ThemeToggler';
import { getToken } from 'firebase/messaging';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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
  const [taskCount, setTaskCount] = useState<number>(0); // Track total number of tasks
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [filterOwner, setFilterOwner] = useState<string>(''); 
  const [filterStatus, setFilterStatus] = useState<string>(''); 
  const [sortBy, setSortBy] = useState<string>('taskName'); 
  const [sortOrder, setSortOrder] = useState<string>('asc'); 
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [filterDate, setFilterDate] = useState<Date | null>(null);  // Track selected date for filtering

  const { colorMode } = useColorMode(); 

  // Request notification permission and get FCM token
  async function requestPermission() {
    const permission = await Notification.requestPermission(); 
    if (permission === "granted") {
      const token = await getToken(messaging, { vapidKey: 'BPKYw-kKecE9hIdsL1F3vO6VxDgh-5X9st3R7ElfkmiDmN1tc3iRRdHSDa-2l_M-NPOzBT2aYM2TVQ31AjTgtjg' });
      console.log('FCM token generated:', token);
    } else if (permission === "denied") {
      alert("You denied the notification permission");
    }
  }  

  useEffect(() => {
    requestPermission();
  }, []);

  // Fetch tasks and filter by owner/status if necessary
  const fetchTasks = async (userId: string) => {
    setLoading(true);
    let tasksData: Task[] = [];

    try {
      const tasksRef = collection(db, 'tasks');
      const q = query(tasksRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      tasksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];

      // Apply filters
      let filteredTasks = tasksData;
      if (filterOwner) {
        filteredTasks = filteredTasks.filter((task) => task.username === filterOwner);
      }

      if (filterStatus) {
        filteredTasks = filteredTasks.filter((task) => task.status === filterStatus);
      }

      if (filterDate) {
        filteredTasks = filteredTasks.filter((task) => {
          const taskDate = new Date(task.createdAt.seconds * 1000); // Convert Firestore timestamp to JS Date
          return taskDate.toLocaleDateString() === filterDate.toLocaleDateString();
        });
      }

      setTasks(filteredTasks);
      setTaskCount(filteredTasks.length); // Update task count

    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign in using email/password
  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError('Invalid email or password. Please try again.');
    }
  };

  // Sign up using email/password
  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError('Error creating account. Please check the details and try again.');
    }
  };

  // Sign out the user
  const handleSignOut = async () => {
    await signOut(auth);
    alert('Successfully signed out!');
  };

  // Sign in using Google
  const googleProvider = new GoogleAuthProvider();
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError('Error signing in with Google. Please try again.');
    }
  };

  // Handle online/offline status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) fetchTasks(user.uid);
      alert('Sign in successful!');
    });

    const updateOnlineStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('offline', updateOnlineStatus);
    window.addEventListener('online', updateOnlineStatus);

    return () => {
      unsubscribe();
      window.removeEventListener('offline', updateOnlineStatus);
      window.removeEventListener('online', updateOnlineStatus);
    };
  }, []);

  // Sorting function
  const sortTasks = () => {
    const sortedTasks = [...tasks];
    sortedTasks.sort((a, b) => {
      if (sortBy === 'taskName') {
        return sortOrder === 'asc'
          ? a.taskName.localeCompare(b.taskName)
          : b.taskName.localeCompare(a.taskName);
      } else if (sortBy === 'createdAt') {
        const dateA = a.createdAt.seconds;
        const dateB = b.createdAt.seconds;
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
    setTasks(sortedTasks);
  };

  return (
    <Box
      bg={colorMode === 'dark' ? '  #004b66' : ' #fff2c2'}
      minH="100vh"
      w="100vw"
      h="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      // py={5}
      // px={10}
      
    >
      <Container
        maxW="lg"
        bg={colorMode === 'dark' ? '#0077b3' : '#ffccff' } 
        borderRadius="lg"
        boxShadow="lg"
        p={6}
        h="auto"
        
      >
        {user ? (
          <>
            <VStack spacing={5} align="center" width="100%">
              <Heading size="lg" color={colorMode === 'dark' ? 'white' : 'grey.600'} textAlign="center">
                Welcome, {user.displayName || 'User'}
              </Heading>

              {/* Theme Toggle Component */}
              <ThemeToggler />

              <Text fontSize="lg" color={colorMode === 'dark' ? 'white' : 'gray.600'} fontWeight="bold" textAlign="center">
                Total Tasks : {taskCount} {/* Display total task count */}
              </Text>

              {/* Display offline status */}
              <Center>
                {isOffline && (
                  <Text color="red.500" fontSize="md">
                    You are offline. Changes will sync once you're back online.
                  </Text>
                )}
              </Center>

              {/* Filter Section */}
              <Stack direction="row" spacing={4} mb={5}>
                <FormControl>
                  <FormLabel  color={colorMode === 'dark' ? 'white' : 'gray.600'}>Filter by Owner</FormLabel>
                  <Select value={filterOwner} onChange={(e) => setFilterOwner(e.target.value)} placeholder="Select Owner" borderColor={'blackAlpha.500'}  color={colorMode === 'dark' ? 'white' : 'gray.600'}>
                    <option value="Owner1">Ritik</option>
                    <option value="Owner2">Yash</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel  color={colorMode === 'dark' ? 'white' : 'gray.600'}>Filter by Status</FormLabel>
                  <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} placeholder="Select Status" borderColor={'blackAlpha.500'} color={colorMode === 'dark' ? 'white' : 'gray.600'}>
                    <option value="Pending" >Pending</option>
                    <option value="Completed">Completed</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel  color={colorMode === 'dark' ? 'white' : 'gray.600'}>Filter by Date</FormLabel>
                  <DatePicker 
                    selected={filterDate}
                    onChange={(date: Date | null) => setFilterDate(date)} // Updated to handle null
                    placeholderText ="Select a Date"
                    dateFormat="yyyy-MM-dd" 
                  />
                </FormControl>
              </Stack>

              <Button colorScheme="green" onClick={() => fetchTasks(user.uid)} mb={5} borderRadius = {20} color={colorMode === 'dark' ? 'grey.600' : 'grey.600'}>
                Search Tasks
              </Button>

              <AddTaskForm fetchTasks={fetchTasks} user={user} />
              <Divider borderColor="gray.300" />

              {/* Task List Display */}
              {loading ? (
                <Spinner size="lg" color="teal.500" />
              ) : tasks.length === 0 ? (
                <Text  color={colorMode === 'dark' ? 'white' : 'gray.600'} textAlign="center" >
                  No tasks available. Add a task!
                </Text>
              ) : (
                <TaskList tasks={tasks} fetchTasks={fetchTasks} userId={user.uid} />
              )}

              <Button colorScheme="red" onClick={handleSignOut} width="50%" ml={5} borderRadius={20} color={colorMode === 'dark' ? 'grey.600' : 'grey.600'}>
                Sign Out
              </Button>
            </VStack>
          </>
        ) : (
          <VStack spacing={5} align="center" width="100%">
            <Text fontSize={30} color={colorMode === 'dark' ? 'gray.300' : 'gray.600'} fontWeight="bold" textAlign="center">
              Please Sign In To Access Your Tasks
            </Text>

            {/* Sign In Form */}
            <form onSubmit={signIn}>
              <FormControl isInvalid={!!error} mb={4}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input 
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  mb={3}
                  
                />
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  mb={3}
                />
                {error && <FormErrorMessage>{error}</FormErrorMessage>}
                <Button colorScheme="teal" width="100%" type="submit" mb={3} borderRadius={10}>
                  Sign In
                </Button>
              </FormControl>
            </form>

            <Button colorScheme="blue" onClick={signUp} mb={3} borderRadius={20}>
              Sign Up
            </Button>

            <Button colorScheme="red" onClick={signInWithGoogle} mb={3} width="60%">
              Sign In with Google
            </Button>
          </VStack>
        )}
      </Container>
    </Box>
  );
};

export default App;

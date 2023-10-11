import React, { useState, useEffect } from 'react';
import { TextInput, Button, Select } from '@mantine/core';
import { useForm,isNotEmpty,isEmail} from '@mantine/form';
import { getDatabase, ref, set, child, remove, onValue, off } from 'firebase/database';
import { useAppDispatch, FetchPositions } from './Store';
import { PositionTree } from './PositionTree';
import { Position, Employee } from './PositionTree';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { AsyncThunkAction, AnyAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid';
import { AiOutlineEdit } from 'react-icons/ai';
import { query, orderByChild, equalTo, get } from "firebase/database";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User } from 'firebase/auth';
export const Config = {
    apiKey: "AIzaSyAeqfuDaABRKYvdgneWiptC0fMrQsOepw4",
    authDomain: "employee-list-d5b9f.firebaseapp.com",
    databaseURL: "https://employee-list-d5b9f-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "employee-list-d5b9f",
    storageBucket: "employee-list-d5b9f.appspot.com",
    messagingSenderId: "505041054295",
    appId: "1:505041054295:web:9ca64a4f39d829f9acd112",
    measurementId: "G-XN8H9BGXS7"
  };
  
  let app;
  if (!getApps().length) {
    app = initializeApp(Config);
  } else {
    app = getApp();
  }
  
  const db = getDatabase(app)
  interface UpdatePositionProps {
    user: User | null;
  }

  export const UpdatePosition = ({ position, user }: { position: Position } &  UpdatePositionProps) => {
    const [showUpdatePosition, setShowUpdatePosition] = useState(false);
    const handleToggle = () => {
      if (!user) {
        toast.error('Please log in to to update position.');
        return;
      }
      setShowUpdatePosition(!showUpdatePosition);
    };
    const handleCancel = () => {
      setShowUpdatePosition(false);
    };
    const dispatch = useAppDispatch();
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
    const [positions, setPositions] = useState<Position[]>([]);
    
    const form = useForm<{ name: string; parentId: string | null; positionId: string }>({
      initialValues: {
        name: '',
        parentId: null,
        positionId: '',
      },
      validate: {
    
        name: isNotEmpty('Enter position'),
      
        
      },
    });
    useEffect(() => {
      form.setFieldValue('name', position.name);
      form.setFieldValue('positionId', position.id);
      form.setFieldValue('parentId', position.parentId || 'none');
      setSelectedPosition(position); // Set selectedPosition state
    }, [position]);
    useEffect(() => {
      const dbRef = ref(getDatabase());
      const listener = onValue(child(dbRef, 'positions/'), (snapshot) => {
        if (snapshot.exists()) {
          setPositions(Object.values(snapshot.val()));
        } else {
          console.log("No data available");
        }
      }, (error) => {
        console.error(error);
      });
  
      // Cleanup the listener when the component unmounts
      return () => off(dbRef, 'value', listener);
    }, []);
    
    
    // Use Effect hook to trigger the handlePositionSelect when position prop changes
  
    const handleParentSelect = (value: string) => {
      form.setFieldValue('parentId', value === 'none' ? null : value);
    };
  
    const handleSubmit = form.onSubmit((values) => {
      if (!values.positionId) {
        toast.warn('Please select a position first.');
        return;
      }
    
      // Rule 1: Top level position can only update its name
      if (selectedPosition?.parentId === null && values.parentId !== 'none') {
        toast.info('Top level position can only update its name.');
        return;
      }
    
      const potentialParent = positions.find(p => p.id === values.parentId);
    
      // Rule 3: A child cannot become a parent of its parent or its ancestors
      if (potentialParent && values.parentId !== null) {
        let parentId: string | null = potentialParent.parentId;
        while (parentId !== null) {
          if (selectedPosition && parentId === selectedPosition.id) {
          toast.error('A position cannot become a child of its descendants.');
            return;
          }
          const current = positions.find(p => p.id === parentId);
          if (!current) {
            break;
          }
          parentId = current.parentId;
        }
      }
      
      const updatedPosition = {
        id: values.positionId,
        name: values.name,
        parentId: values.parentId === 'none' ? null : values.parentId,
      };
    
      set(ref(getDatabase(), 'positions/' + updatedPosition.id), updatedPosition)
        .then(() => {
          toast.success('Data updated successfully');
          form.reset();
          dispatch(FetchPositions());
          handleToggle();
        })
        .catch((error) => {
          toast.error('Data update failed:', error);
        });
    });
   
    return (
      <div className="flex items-right justify-end">
           
        {!showUpdatePosition ? (
          <AiOutlineEdit className="hover:scale-125" onClick={handleToggle} />
        ) : (
          <div className="flex items-center z-50">
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white w-1/2 rounded p-6">
                <h2>Update Position</h2>
                <form onSubmit={handleSubmit}>
                  <TextInput
                    label="Name"
                   
                    value={form.values.name}
                    onChange={(event) => form.setFieldValue('name', event.target.value)}
                  />
                <Select className='mt-2'
                  key={positions.length}
                  label="Parent Id"
                  placeholder="Select a parent position"
                  data={[
                    { label: '', value: 'none' },
                    ...positions
                      .filter(position => position.id !== selectedPosition?.id)
                      .sort((a, b) => a.name.localeCompare(b.name)) // Add this line to sort by name
                      .map(({ name, id }) => ({ label: name, value: id })),
                  ]}
                  value={form.values.parentId || 'none'}
                  onChange={handleParentSelect}
                  clearable
                />
                  <Button variant="outline" type="submit" disabled={selectedPosition?.parentId === null}>
                    Update Position
                  </Button>
                  <Button  variant="outline" color='red' className="m-3 hover:bg-red-300/50" onClick={handleCancel}>
                    Cancel
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};



  export const UpdateEmployee = ({ employee,user }: { employee: Employee }&  UpdatePositionProps) => {
    const [showUpdateEmployee, setShowUpdateEmployee] = useState(false);
    const [positions, setPositions] = useState<Position[]>([]);
  
    const handleToggle = () => {
      if (!user) {
        toast.error('Please log in to update an employee.');
        return;
      }
      setShowUpdateEmployee(!showUpdateEmployee);
    };
  
    const handleCancel = () => {
      setShowUpdateEmployee(false);
    };
  
    const dispatch = useAppDispatch();
  
    useEffect(() => {
      const dbRef = ref(getDatabase());
      get(child(dbRef, 'positions/')).then((snapshot) => {
        if (snapshot.exists()) {
          setPositions(Object.values(snapshot.val()));
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    }, []);
  
    const form = useForm({
      initialValues: {
        id: employee.id,
        email: employee.email,
        name: employee.name,
        positionId: employee.positionId, // this will now hold the position id
      },
      validate: {
    
        name: isNotEmpty('Enter your name'),
        email: isEmail('Invalid email'),
        
      },
    });
  
    const handleSubmit = () => {
      const updatedEmployee = {
        id: form.values.id,
        email: form.values.email,
        name: form.values.name,
        positionId: form.values.positionId,
      };
  
      set(ref(db, 'employees/' + updatedEmployee.id), updatedEmployee)
        .then(() => {
         toast.success('Data updated successfully');
          form.reset();
          dispatch(FetchPositions()); // trigger a re-fetch
          handleToggle();
        })
        .catch((error) => {
         toast.error('Data update failed:', error);
        });
    };
  
    return (
      <div className="flex items-right justify-end">
        {!showUpdateEmployee ? (
          <AiOutlineEdit className="cursor-pointer hover:scale-125" onClick={handleToggle} />
        ) : (
          <div className="flex items-center z-50">
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white w-1/2 rounded p-6">
                <h2>Update Employee</h2>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <TextInput label="Email"  {...form.getInputProps('email')} />
                  <TextInput label="Name"  {...form.getInputProps('name')} />
                  <Select
  key={employee.positionId || 'initial'} // This will change when employee's positionId changes, causing a re-render
  label="Position"
  placeholder="Select a position"
  required
  data={positions
    .sort((a, b) => a.name.localeCompare(b.name)) // sort the positions array before mapping it
    .map(position => ({ value: position.id, label: position.name }))}
  {...form.getInputProps('positionId')}
/>

                  <Button variant="outline" type="submit">Update Employee</Button>
                  <Button variant="outline" color='red' className=" m-3 hover:bg-red-300/50" onClick={handleCancel}>Cancel</Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  

 
  
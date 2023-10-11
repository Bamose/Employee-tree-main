import React, { useState, useEffect } from 'react';
import { TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { getDatabase, ref, set, child, remove,onValue,off } from 'firebase/database';
import { useAppDispatch, FetchPositions,FetchEmployees } from './Store';
import { PositionTree } from './PositionTree';
import { Position,Employee } from './PositionTree';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { AsyncThunkAction, AnyAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid';
import { query, orderByChild, equalTo, get } from "firebase/database";
 import { Select, SelectItem } from '@mantine/core';
 import { AiOutlineDelete } from 'react-icons/ai';
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
  
  const db = getDatabase(app);


// ... other code
interface DeleteProps {
  user: User | null;
}

export const DeletePosition = ({ position,user }: { position: Position } & DeleteProps) => {
  const dispatch = useAppDispatch();
  const [showDeletePosition, setShowDeletePosition] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);

  const handleToggle = () => {
    if (!user) {
      toast.error('Please log in to delete a position.');
      return;
    }
    setShowDeletePosition(!showDeletePosition);
  };

  const handleCancel = () => {
    setShowDeletePosition(false);
  };

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

  const handleDelete = () => {
    const hasChildPositions = positions.some(pos => pos.parentId === position.id);
  
    if (hasChildPositions) {
      toast.error("This position has child positions. You cannot delete it.");
    } else {
      
        remove(ref(db, 'positions/' + position.id))
          .then(() => {
            toast.success('Position deleted successfully');
            dispatch(FetchPositions()); // Refresh positions
            handleToggle();
          })
          .catch((error) => {
            console.error('Failed to delete position:', error);
          });
      
    }
  };
  

  return (
    <div className="flex items-right justify-end z-10">
      {!showDeletePosition ? (
        <AiOutlineDelete
          className="hover:scale-125"
          onClick={handleToggle}
        />
      ) : (
        <div className="flex items-center z-50">
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white w-1/3 rounded p-6">
              <h2>Delete Position</h2>
              <p>Are you sure you want to delete the position "{position.name}"?</p>
              <Button variant="outline" color="red" onClick={handleDelete}>Delete Position</Button>
           
              <Button variant="outline" 
                className=" m-3 "
                onClick={handleCancel}
              >Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export const DeleteEmployee = ({ employee, user }: { employee: Employee }& DeleteProps) => {
  const dispatch = useAppDispatch();
  const [showDeleteEmployee, setShowDeleteEmployee] = useState(false);

  const handleToggle = () => {
    if (!user) {
      toast.error('Please log in to delete an employee.');
      return;
    }
    setShowDeleteEmployee(!showDeleteEmployee);
  };

  const handleCancel = () => {
    setShowDeleteEmployee(false);
  };

  const handleDelete = () => {
    // Show a confirmation dialog before deleting
 
      remove(ref(db, 'employees/' + employee.id))
        .then(() => {
          toast.success('Employee deleted successfully');
          dispatch(FetchPositions()); // Refresh positions
          dispatch(FetchEmployees());
          handleToggle();
        })
        .catch((error) => {
          console.error('Failed to delete employee:', error);
        });
    
  };


  return (
    <div className="flex items-right justify-end z-10">
  {!showDeleteEmployee ? (
   <AiOutlineDelete
   className="hover:scale-125"
   onClick={handleToggle}
 >
   
 </AiOutlineDelete>
  ) : (
  <div className="flex items-center z-50">
   
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white w-1/3 rounded p-6">
      <h2>Delete Employee</h2>
      <p>Are you sure you want to delete this employee?</p>
        <Button variant="outline" color='red' onClick={handleDelete}>
          Delete Employee
        </Button>
      <Button variant='outline' 
            className=" hover:bg-slate-400/50 m-3"
            onClick={handleCancel}
          >
            Cancel
          </Button>
      </div>
    </div>
  </div>
  )}
  </div>
  )
  };

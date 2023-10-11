import React, { useEffect,useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './Store';
import { useAppDispatch, FetchPositions } from './Store';
import { Table, Col, Paper } from '@mantine/core';
import '../index.css';
import { Employee, EmployeesMap,Position, PositionsMap } from "./PositionTree";
import {UpdatePosition, UpdateEmployee } from "./Update";
import { DeletePosition, DeleteEmployee } from "./Delete";
import { getAuth, onAuthStateChanged,User } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
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
export const firebaseApp = initializeApp(Config);
const auth = getAuth(firebaseApp);
const flattenPositions = (positions: Position[]): Position[] => {
    let flattened: Position[] = [];
  
    const helper = (position: Position) => {
      flattened.push(position);
  
      if (position.children) {
        position.children.forEach(helper);
      }
    };
  
    positions.forEach(helper);
  
    return flattened;
  };
  
  export const PositionTable: React.FC = () => {
    const positions = useSelector((state: RootState) => state.positions as Position[]);
    const dispatch = useAppDispatch();
    const [user, setUser] = useState<User | null>(null); 
    useEffect(() => {
      // Listen for changes in user authentication state
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is logged in
          setUser(user);
        } else {
          // User is not logged in
          setUser(null);
        }
      });
  
      // Clean up the subscription on unmount
      return () => unsubscribe();
    }, []); 
    useEffect(() => {
      dispatch(FetchPositions());
    }, [dispatch]);
  
    const flattenedPositions = flattenPositions(positions);
  
    return (
      <div className=" max-h-80  ml-16 mt-10 w-2/3  overflow-y-scroll shadow-md rounded-lg z-0">
        <table className="w-full divide-y  max-h-80 divide-gray-200 ">
          <thead className="bg-slate-100 sticky z-0 top-0 ">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                Email
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {flattenedPositions.map((position: Position) => (
              <tr key={position.id}>
                <td className="px-6 py-4 whitespace-nowrap w-1/3">
                  <div className="text-sm font-medium text-gray-900">
                    <div className="flex justify-between items-center"> 
                      <div>{position.name}</div>
                      <div className='flex items-center'>
                        <div className='cursor-pointer hover:text-blue-600 transition-colors'>
                          <UpdatePosition position={position} user={user}/>
                        </div> 
                        <div className='ml-3 cursor-pointer '><DeletePosition position={position} user={user}/></div>
                      </div>
                    </div>
                  </div>
                </td>
                {position.employees?.map((employee) => (
                  <>
                  <td className="px-6 py-4 bg-whit whitespace-nowrap w-1/3">
                    <div className="flex flex-col space-y-2">
                      <div key={employee.id} className="text-sm text-gray-500">
                        <div className="flex justify-between items-center">
                          <div>{employee.name}</div>
                          <div className="flex items-center">
                            <div className="cursor-pointer "><UpdateEmployee employee={employee} user={user} /></div>
                            <div className="ml-3 cursor-pointer"><DeleteEmployee employee={employee} user={user} /></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-1/3">
                    <div className="flex flex-col space-y-2">
                      <div key={employee.id} className="text-sm text-gray-500">
                        <div>{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  </>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
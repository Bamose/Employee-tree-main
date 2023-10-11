import { configureStore, createSlice,createAsyncThunk, MiddlewareArray,ConfigureStoreOptions ,  AnyAction, AsyncThunkAction  } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Employee, EmployeesMap,Position, PositionsMap } from "./PositionTree";
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from "redux-logger";
import "../index.css";

  
export const FetchPositions = createAsyncThunk<Position[], void, { state: RootState }>(
  'positions/fetch',
  async () => {
    try {
      const response = await axios.get<PositionsMap>('https://employee-list-d5b9f-default-rtdb.europe-west1.firebasedatabase.app/positions.json');
      
      if (!response.data) {
        console.log("No positions data available");
        return [];
      }

      // Convert the object to an array and filter out any null entries
      const dataArr = Object.values(response.data).filter((item: Position | null): item is Position => item !== null);

      // Convert the filtered array to a map for easy access
      const positionsMap = dataArr.reduce((acc: PositionsMap, curr: Position) => {
        acc[curr.id] = { 
          ...curr, 
          children: curr.children || [],  // Ensuring children is always an array
          employees: curr.employees || [] // Ensuring employees is always an array
        };
        return acc;
      }, {});

      // Add positions as children to their respective parents
      for (const id in positionsMap) {
        const position = positionsMap[id];
        if (position.parentId && positionsMap[position.parentId]) {
          positionsMap[position.parentId].children.push(position);
        }
      }

      // Fetch employees and add them to their respective positions
      const employeeResponse = await axios.get<EmployeesMap>('https://employee-list-d5b9f-default-rtdb.europe-west1.firebasedatabase.app/employees.json');
      const employees = Object.values(employeeResponse.data).filter(Boolean);
      for (const employee of employees) {
        if (employee.positionId && positionsMap[employee.positionId]) {
          positionsMap[employee.positionId].employees.push(employee);
        }
      }

      // Filter out the top-level positions
      const topLevelPositions = Object.values(positionsMap).filter((position) => !position.parentId);
      console.log('Top level positions:', topLevelPositions);
      return topLevelPositions;

    } catch (error) {
      console.error('axios error:', error);
      throw error; // this will be handled by rejected action
    }
  }
);

export const FetchEmployees = createAsyncThunk<Employee[], void, { state: RootState }>(
  'employees/fetch',
  async () => {
      try {
          const response = await axios.get<EmployeesMap>('https://employee-list-d5b9f-default-rtdb.europe-west1.firebasedatabase.app/employees.json');
          if (!response.data) {
            console.log("No employees data available");
            return [];
          }
          // Convert the object to an array
          const dataArr = Object.values(response.data);

          // Filter out any null entries in the array
          const filteredData = dataArr.filter((item: Employee | null): item is Employee => item !== null);

          console.log('Fetched employees:', filteredData);
          return filteredData;

      } catch (error) {
          console.error('axios error:', error);
          throw error; // this will be handled by rejected action
      }
  }
) 
// ... rest of your code ...

const employeesSlice = createSlice({
  name: 'employees',
  initialState: [] as Employee[],
  reducers: {},
  extraReducers: (builder) => {
      builder.addCase(FetchEmployees.fulfilled, (state, action) => {
        if (action.payload) {
          return action.payload;
        }
        return state; 
      });
      builder.addCase(FetchEmployees.rejected, (state, action) => {
        console.error('Failed to fetch employees:', action.error);
      
        return state;
      });
  },
});
   // Filter out the top-level employees and set as state
 
   const positionsSlice = createSlice({
    name: 'positions',
    initialState: [] as Position[],
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(FetchPositions.fulfilled, (state, action) => {
        if (action.payload) {
          return action.payload;
        }
        return state; // If the payload is undefined, return the current state
      });
      builder.addCase(FetchPositions.rejected, (state, action) => {
        console.error('Failed to fetch positions:', action.error);
        // Handle the error in your state if necessary, for example:
        // return { ...state, error: action.error };
        // Or just return the current state:
        return state;
      });
    },
  });

  export const Store = configureStore({
    reducer: {
      positions: positionsSlice.reducer,
      employees: employeesSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(/* Add any additional middleware if needed */),
    devTools: true, // Enable Redux DevTools extension
  });
  
  export type RootState = ReturnType<typeof Store.getState>;
  
  type AppDispatch = typeof Store.dispatch;
  export const useAppDispatch = () => useDispatch<AppDispatch>();
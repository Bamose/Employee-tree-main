import React, { useState,useEffect } from 'react';
import { getAuth, onAuthStateChanged,User } from 'firebase/auth';
import { MantineProvider, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import './App.css';
import './index.css';
import { Nav } from './components/Nav';
import { RegisterEmployee } from './components/RegisterEmployee';
import { RegisterPosition } from './components/RegisterPosition';
import { Provider } from 'react-redux';
import { Store } from './components/Store';
import { PositionTree } from './components/PositionTree';
import SlideImages from './components/Slideimages';
import { PositionTable } from './components/Table';
import { CSSTransition } from 'react-transition-group';
import Scrollspy from 'react-scrollspy';
import { ToastContainer } from 'react-toastify';
import firebase from 'firebase/app'
import Login from './components/login';
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

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Specify the User type from Firebase


  // Listen for changes in user authentication state
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
  return (
    <MantineProvider>
      <ToastContainer />
      <Scrollspy
        items={['home', 'register', 'employee', 'footer']}
        currentClassName="is-current"
        onUpdate={(el) => setCurrentSection(el?.id)}
      >
        <div className="sticky top-0 bg-white/100  shadow-md  z-20">
        <Nav onLoginClick={() => setIsLoginModalOpen(true)} user={user} />
        </div>

        <CSSTransition in={currentSection === 'home'} classNames="fade-and-scale" timeout={500}>
          <section className="h-100vh" id="home">
            <SlideImages />
          </section>
        </CSSTransition>

        <CSSTransition in={currentSection === 'register'} classNames="fade-and-scale" timeout={500}>
        <section id="register">
  <Provider store={Store}>
    <div className="flex justify-center mt-16">
      <div className="bg-gray-50/75 shadow-lg rounded-lg w-4/6 pb-10 mx-5">

        <PositionTree />

        <div className="flex justify-center mt-5">
         
        <RegisterEmployee user={user} />
         
        </div>
        
        <div className="flex justify-center mt-5">
         
            <RegisterPosition  user={user}/>
          
        </div>

      </div>
    </div>
  </Provider>
</section>

        </CSSTransition>
        
        <CSSTransition in={currentSection === 'employee'} classNames="fade-and-scale" timeout={500}>
          <section id="employee">
            <Provider store={Store}>
            <div className=" mt-7">
            <div className="flex items-center justify-center w-full mt-10 cursor-pointer hover:scale-110 ">
              <h1 className="border border-solid p-4 w-52 border-gray-700 rounded bg-transparent text-center"> Employee List </h1> 
            </div>
            <div className="flex items-center justify-center w-full" >
              <PositionTable />  
            </div>
          </div>
            </Provider>
          </section>
        </CSSTransition>
        {isLoginModalOpen && (
        <CSSTransition in={isLoginModalOpen} classNames="fade-and-scale" timeout={500}>
          <div id="login">
            <Login onClose={() => setIsLoginModalOpen(false)} />
          </div>
        </CSSTransition>
      )}
        
          <section id="footer">
          <div className=" flex items-center h-20 mt-10 bg-slate-400/25 shadow-md border-t border-gray">
          <div className="flex items-center justify-start">
            <h1 className="pl-20 text-slate-600"><i><span className="text-3xl font-bold text-amber-500 ">H</span></i>star PLC.</h1>
            <ul>
              <li></li>
            </ul>
          </div>
          </div>
          </section>
        
      </Scrollspy>
    </MantineProvider>
  );
}
export default App;
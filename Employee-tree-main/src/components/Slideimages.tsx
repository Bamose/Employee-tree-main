import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import "../App.css";
import "../index.css";

const divContents = [
  {id: 1, content: 
    <div className="h-70 flex flex-col justify-center">
      <div className="flex items-center justify-center pt-6 cursor-pointer hover:scale-110">
        <h1 className="border border-solid p-4 w-52 border-gray-700 rounded bg-transparent text-center"> Registration </h1>
      </div>
      <div className='items-center pt-6'>
        <p className='px-52'>
        Registering on our company's Hstar website is a hassle-free experience that prioritizes user convenience. Our innovative 
        registration process, powered by the intuitive position tree concept, is designed to make the onboarding process effortless and efficient. 
        </p>
      </div>
      <div className="flex items-center justify-center  pt-12">
      <a href="#register" className="text-white-500 hover:text-white-700"> <button className="bg-amber-500 px-20 py-3 rounded hover:scale-115 hover:bg-amber-400" > Register New Employee </button></a>
      </div>
    </div>
  },
  
  {id: 2, content:  <div className="h-70 flex flex-col justify-center">
  <div className="flex items-center justify-center pt-6 cursor-pointer hover:scale-110">
    <h1 className="border border-solid p-4 w-52 border-gray-700 rounded bg-transparent text-center"> Employees </h1>
  </div>
  <div className='items-center pt-6'>
    <p className='px-52'>
    Our employee list table provides a comprehensive overview of the company's organizational structure, allowing employees to easily identify the positions held by their colleagues. With a user-friendly interface and intuitive design,
    the table offers a clear and organized view of each employee's respective role within the company, facilitating effective collaboration and communication across teams.
    </p>
  </div>
  <div className="flex items-center justify-center  pt-12">
  <a href="#employee" className="text-white-500 hover:text-white-700"><button className="bg-amber-500 px-20 py-3 rounded hover:scale-115 hover:bg-amber-400" >Employee-List </button></a>
  </div>
</div>},
{id: 3, content:  <div className="h-70 flex flex-col justify-center">
<div className="flex items-center justify-center pt-6 cursor-pointer hover:scale-110">
  <h1 className="border border-solid p-4 w-52 border-gray-700 rounded bg-transparent text-center"> Search For Employee </h1>
</div>
<div className='items-center pt-6'>
  <p className='px-52'>
  The employee search functionality in this application provides an efficient way to locate employees in a large organization. By simply typing the name of an employee, you can quickly filter out the hierarchy tree and highlight the employee's position in real-time. 
  </p>
</div>
<div className="flex items-center justify-center  pt-12">
<a href="#register" className="text-white-500 hover:text-white-700"><button className="bg-amber-500 px-20 py-3 rounded hover:scale-115 hover:bg-amber-400" > Search Employee </button></a>
</div>
</div>}
];




export const SlideImages = () => {  const properties = {
    duration: 5000,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: true,
    autoplay: true,
    canSwipe: true,
    prevArrow: <div style={{/* width: "30px", marginRight: "0px" */}}><svg></svg></div>,
    nextArrow: <div style={{/* width: "30px", marginLeft: "0px" */}}><svg></svg></div>,
  }

  return (
    <div className="slide-container custom-slide-height">
      <Slide {...properties}>
        {divContents.map(({id, content}) => 
          <div key={id} className="each-slide custom-slide-height">
            {content}
          </div>
        )}
      </Slide>
    </div>
  );
  }
export default SlideImages;

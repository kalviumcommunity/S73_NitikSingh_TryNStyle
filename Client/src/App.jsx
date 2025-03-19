import React from "react"; // Importing react necessary to create React components

const dummyData = [
  { id: 1, name: "Product 1", price: "$10" },
  { id: 2, name: "Product 2", price: "$20" },
  { id: 3, name: "Product 3", price: "$30" },
];
//Array of an object
//defines a Ract functional component named APP.
//return Everything inside this JSX(Similar to HTML but inside JavaScript)
function App() {
  return (
    //outter div is used to wrap every thing
    //style prop is used to apply inline cSS for Padding and font.
//rendering dammy data by using .map
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6"> 
      <h1 className="text-3xl font-bold text-red-800 mb-6">Frontend Test</h1>    
      <ul>
        {dummyData.map((item) => (
          <li key={item.id} className="border-b last:border-none p-3 text-lg font-medium text-gray-700 flex justify-between">
             <span>{item.name}</span>
             <span className="text-green-600">{item.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App; // this makes the App component availabe to be used in main.js where React renders it to the browser.

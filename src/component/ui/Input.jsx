// import React from "react";
// import { cn } from "./cn";


// export const label =({htmlFor, children, className}) =>{
//     return(
//         <label htmlFor={htmlFor}
//         className={cn("text-sm font-semibold tracking-wide ", className)}>
//               {children}
//         </label>
//     )
// }


// const Input = ({ type, className, placeholder, id, name, onChange, value }) => {
//   return (
//     <div>
//       <input
//         type={type}
//         id={id}
//         name={name}
//         placeholder={placeholder}
//         onChange={onChange}
//         value={value}
//         className={cn("border px-4 py-1 border-gray-500 rounded-md max-w-lg")}
//       />
//     </div>
//   );
// };

// export default Input;




import React from "react";
import { cn } from "./cn";

export const Label = ({ htmlFor, children, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("text-sm font-semibold tracking-wide", className)}
    >
      {children}
    </label>
  );
};

const Input = ({ type, className, placeholder, id, name, onChange, value, disabled }) => {
  return (
    <div>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        disabled={disabled}
        className={cn(
          "border px-4 py-1 border-gray-500 rounded-md max-w-lg",
          className
        )}
      />
    </div>
  );
};

export default Input;

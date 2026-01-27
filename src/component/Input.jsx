import React from 'react'
import {cn} from "./ui/cn"

const Input = ({type, className, placeholder, id, name, onChange, value}) => {
  return (
    <input
    type={type}
    id={id}
    placeholder={placeholder}
    name={name}
    onChange={onChange}
    value={value}
    className={cn("border px-4 border-gray-500 rounded-md max-w-lg" ,
        className)}    />
  )
}

export default Input; 
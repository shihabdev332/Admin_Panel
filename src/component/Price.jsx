import React from 'react'
import { twMerge } from 'tailwind-merge'

const Price = ({amount}) => {

    const priceAmount = new Number(amount).toLocaleString("en-US",{
        style:"currency",
        currency:"USD",
        minimumFractionDigits:2,
    })
  return (
    <span className={twMerge('text-base font-medium', 
    )}>
        {priceAmount}
    </span>
  )
}

export default Price
'use client'

import { useState } from "react"

export default function card({ title }) {
    if (!title) { return <div>Empty</div> }
    const [count, setCount] = useState(0);

    const handleClick = (e) => {
        e.preventDefault();
        setCount(count + 1);
    }

    return (
        <div className="m-0">
            <h1 >{title}</h1>
            <p>No of times : {count}</p>
            <button onClick={handleClick} className="bg-slate-400 p-2 rounded-lg">Click me</button>
        </div>
    )
}

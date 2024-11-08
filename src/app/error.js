'use client'
import { useEffect } from "react";

export default function Error({ error, reset }) {

    useEffect(() => {
        console.log('error is', error);
    }, [error])

    const retryReqHandler = () => {
        reset()
    }

    return <div>
        <h2>
            <h1>Something went WRONGE</h1>
            <button onClick={retryReqHandler}>Retry Request</button>
        </h2>
    </div>
}
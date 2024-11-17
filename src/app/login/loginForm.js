'use client'

import { useState } from 'react'

export default function LoginForm({ didSubmit }) {
    const [results, setResults] = useState(null)
    const [message, setMessage] = useState(null)

    const handleForm = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const data = Object.fromEntries(formData)
        const JSONData = JSON.stringify(data)
        const endpoint = "/api/auth/login/"
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSONData
        }
        const response = await fetch(endpoint, options)
        if (response.status === 200) {
            window.location.href = "/"
        }
        const result = await response.json()

        setResults(result)
        if (didSubmit) {
            didSubmit(result)
        }
        if (result.message) {
            setMessage(result.message)
        }
    }

    return (
        <>
            {message && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                    {message}
                </div>
            )}
            <form className="flex max-w-md flex-col gap-4" onSubmit={handleForm}>

                {/* Username Field */}
                <div>
                    <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-700">
                        Your username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Your username"
                        required
                        className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Password Field */}
                <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                        Your password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="*******"
                        required
                        className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="mt-4 w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Login
                </button>

            </form>
        </>
    )
}

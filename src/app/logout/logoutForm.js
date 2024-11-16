'use client'

import Link from 'next/link'

export default function LogoutForm({ didSubmit }) {

    const handleForm = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const data = Object.fromEntries(formData)
        const JSONData = JSON.stringify(data)
        const endpoint = "/api/auth/logout/"
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSONData
        }
        const response = await fetch(endpoint, options)
        if (response.status === 200) {
            window.location.href = "/login"
        }
    }

    return (
        <>
            <form className="flex max-w-md flex-col gap-4" onSubmit={handleForm}>
                <div className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to logout?</div>

                {/* Yes, continue button */}
                <button
                    type="submit"
                    className="mb-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Yes, continue
                </button>

                {/* No, go home button */}
                <Link href="/" passHref>
                    <button
                        type="button"
                        className="px-4 py-2 text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        No, go home
                    </button>
                </Link>
            </form>
        </>
    )
}

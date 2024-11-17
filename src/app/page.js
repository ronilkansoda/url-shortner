import Image from 'next/image'
import { getSessionUser } from './lib/session'
export default async function Home() {
  const user = await getSessionUser()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-12">
    
      <h1 className='text-xl font-bold'>This is Home!</h1>
      {user && <div>{user}</div>}
    </main>
  )
}
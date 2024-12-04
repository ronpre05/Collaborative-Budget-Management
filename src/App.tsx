import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { useEffect } from 'react'
import { supabase } from './database' // Assuming you exported `supabase` from `database.tsx`



const HandleUserLogin = async (user: any) => {
  console.log("HandleUserLogin was called!", user)

  if (!user) {
    console.error("No user found in Clerk.")
    return
  }

  const email = user.primaryEmailAddress?.emailAddress
  const username = user.username || user.firstName || email
  const firstName = user.firstName || "Unknown"; // Fallback value for firstName
  const lastName = user.lastName || "Unknown";
  const passwordHash = user.id

  if (!email || !username) {
    console.error("Required user information missing.")
    return
  }

  try {
    const { data, error } = await supabase
      .from('Users')
      .select('userID')
      .eq('email', email)

    if (error) {
      throw new Error(`Error checking user existence: ${error.message}`)
    }

    let userId

    if (data && data.length > 0) {
      userId = data[0].userID
      console.log(`User found: ${userId}`)
    } else {
      const { data: newUser, error: insertError } = await supabase
        .from('Users')
        .insert({
          firstName,
          lastName,
          email,
          username,
          passwordHash,
        })
        .select('userID')
        .single()

      if (insertError) {
        throw new Error(`Error creating user: ${insertError.message}`)
      }

      userId = newUser?.userID
      console.log(`New user created: ${userId}`)
    }

    localStorage.setItem('userID', userId)
    console.log(`User session stored with ID: ${userId}`)
    return userId
  } catch (err) {
    console.error(`Error handling user login: ${err.message}`)
  }
}

const App = () => {
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      HandleUserLogin(user)
    }
  }, [user])

  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  )
}

export default App
// function App() {

//   const [count, setCount] = useState(0)

//   return (
//     <header>
//       <SignedOut>
//         <SignInButton />
//       </SignedOut>
//       <SignedIn>
//         <UserButton />
//       </SignedIn>
//     </header>
//   );

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

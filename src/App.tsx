import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { useEffect } from 'react'
import { supabase } from './database' // Assuming you exported `supabase` from `database.tsx`


// this is called after any user signs in
const HandleUserLogin = async (user: any) => {
  console.log("HandleUserLogin was called!", user)

  if (!user) {
    console.error("No user found in Clerk.")
    return
  }
  // information on user is parsed
  const email = user.primaryEmailAddress?.emailAddress
  const username = user.username || user.firstName || email
  const firstName = user.firstName || "Unknown"; // Fallback value for firstName
  const lastName = user.lastName || "Unknown"; // Fallback value for lastname

  if (!email || !username) {
    console.error("Required user information missing.")
    return
  }
  // check if the user exists in supabse User table
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('userID')
      .eq('email', email)

    if (error) {
      throw new Error(`Error checking user existence: ${error.message}`)
    }

    let userId
    // check if corresponding user is found
    if (data && data.length > 0) {
      userId = data[0].userID
      console.log(`User found: ${userId}`)
    } 
    // create a new user if there isnt one already
    else {
      const { data: newUser, error: insertError } = await supabase
        .from('Users')
        .insert({
          firstName,
          lastName,
          email,
          username,
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

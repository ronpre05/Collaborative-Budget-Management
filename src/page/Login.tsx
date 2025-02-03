import { useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { supabase } from '../database';

const HandleUserLogin = async (user: any) => {
  console.log("HandleUserLogin was called!", user);
  if (!user) {
    console.error("No user found in Clerk.");
    return;
  }

  // Extract necessary user details for login or registration.
  const email = user.primaryEmailAddress?.emailAddress;
  const username = user.username || user.firstName || email;
  const firstName = user.firstName || "Unknown";
  const lastName = user.lastName || "Unknown";

  if (!email || !username) {
    console.error("Required user information missing.");
    return;
  }

  try {
    // Check if the user exists in the database by their email.
    const { data, error } = await supabase
      .from('Users')
      .select('userID')
      .eq('email', email);

    if (error) {
      throw new Error(`Error checking user existence: ${error.message}`);
    }

    let userId;
    if (data && data.length > 0) {
      userId = data[0].userID;
      // User exists; fetch their ID and use it in the session.
      console.log(`User found: ${userId}`);
    } else {
      // Register a new user if no matching record is found.
      const { data: newUser, error: insertError } = await supabase
        .from('Users')
        .insert({
          firstName,
          lastName,
          email,
          username,
        })
        .select('userID')
        .single();

      if (insertError) {
        throw new Error(`Error creating user: ${insertError.message}`);
      }

      userId = newUser?.userID;
      console.log(`New user created: ${userId}`);
    }

    localStorage.setItem('userID', userId);
    console.log(`User session stored with ID: ${userId}`);
    return userId;
  } catch (err) {
    console.error(`Error handling user login: ${err.message}`);
  }
};

const LoginPage = () => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      HandleUserLogin(user);
    }
  }, [user]);

  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
};

export default LoginPage;

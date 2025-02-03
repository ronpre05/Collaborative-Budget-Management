import { useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { supabase } from '../database';

const HandleUserLogin = async (user: any) => {
  console.log("HandleUserLogin was called!", user);
  if (!user) {
    console.error("No user found in Clerk.");
    return;
  }

  const email = user.primaryEmailAddress?.emailAddress;
  const username = user.username || user.firstName || email;
  const firstName = user.firstName || "Unknown";
  const lastName = user.lastName || "Unknown";

  if (!email || !username) {
    console.error("Required user information missing.");
    return;
  }

  try {
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
      console.log(`User found: ${userId}`);
    } else {
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
      alert("test");
      HandleUserLogin(user);
    }
    else{
      alert("test2");
    }
  }, [user]);

  return (
    <header>
      <SignInButton/>
    </header>
  );
};

export default LoginPage;

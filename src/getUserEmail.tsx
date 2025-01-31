import { useUser } from "@clerk/clerk-react"; // import clerk hook

const useUserEmail = () => {
  const { user } = useUser(); // get current logged in user

  // user is a big block of JSON
  // primaryEmailAddress is more JSON with stuff like id,
  // whether it's verified or not, etc.
  // emailAddress is the actual email address of the currently logged
  // in user
  return user?.primaryEmailAddress?.emailAddress;
};

export default useUserEmail;

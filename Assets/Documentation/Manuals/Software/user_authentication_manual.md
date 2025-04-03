# Software Manual: User Authentication with Clerk and Supabase

## 1. Introduction

This manual provides an in-depth guide on how authentication is handled in the application using **Clerk** for login/signup and **Supabase** for user storage. Clerk manages user authentication, while Supabase serves as the database backend to store user information. 

The app uses **email verification codes** for login, ensuring secure access. Clerk handles authentication seamlessly, while Supabase maintains user records.



## 2. Authentication Flow

### 2.1 User Signup & Login

1. The user visits the application.
2. If the user is signed out, they are redirected to the **Login Page**.
3. Clerk manages the **email verification** process by sending a **one-time code** to the user's email.
4. Once verified, Clerk retrieves the **authenticated user data**.
5. The app checks if the user exists in the **Supabase database**.
6. If the user does not exist, a new record is **created** in Supabase.



## 3. Implementation Details



### 3.1 Clerk Authentication Setup

To integrate Clerk, the application includes the **ClerkProvider** component, which wraps the main app component:

```
import { ClerkProvider } from '@clerk/clerk-react';

const App = () => (
  <ClerkProvider publishableKey="your-clerk-publishable-key">
    <YourAppComponents />
  </ClerkProvider>
);

export default App;
```
The App.tsx file handles user authentication using Clerk:

```
type Invitation = {
  invitedID: number;
  inviteID: number;
  projectID: number;
  roleID: number;
  status?: string;
  email?: string;
};

function App() {
  // Get currently logged in user from Clerk
  const { user } = useUser();
  const [userID, setUserID] = useState<number | null>(null);
  const [invitations] = useState<Invitation[]>([]);

  // Hook to handle user login once user state is set from Clerk
  useEffect(() => {
    if (user) {
      const fetchUserID = async () => {
        const storedUserID = await HandleUserLogin(user);
        setUserID(storedUserID);
      };
      fetchUserID();
    }
  }, [user]);

  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  return (
    <Router>
      {/* Signed out View */}
      <SignedOut>
        <Login />
      </SignedOut>
      {/* Signed in View */}
      <SignedIn>

```



### 3.2 Handling User Login and Database Storage

The `HandleUserLoginfunction` ensures that once a user logs in via Clerk, they are stored in Supabase:
```
const HandleUserLogin = async (user: any) => {
  console.log("HandleUserLogin was called!", user)
  if (!user) {
    console.error("No user found in Clerk.")
    return
  }

  const email = user.primaryEmailAddress?.emailAddress
  const username = user.username || user.firstName || email
  const firstName = user.firstName || "Unknown"
  const lastName = user.lastName || "Unknown"

  // If missing email or username
  if (!email || !username) {
    console.error("Required user information missing.")
    return
  }

  let userId

  try {
    const { data, error } = await supabase.from("Users").select("userID").eq("email", email)

    if (error) {
      throw new Error(`Error checking user existence: ${error.message}`)
    }

    // If user in db exists
    if (data && data.length > 0) {
      userId = data[0].userID
      console.log(`User found: ${userId}`)
    }
    // If no user found in db
    else {
      // Insert new user info into db
      const { data: newUser, error: insertError } = await supabase
        .from("Users")
        .insert({
          firstName,
          lastName,
          email,
          username,
        })
        .select("userID")
        .single()

      if (insertError) {
        throw new Error(`Error creating user: ${insertError.message}`)
      }

      userId = newUser?.userID
      console.log(`New user created: ${userId}`)
    }

    localStorage.setItem("userID", userId)
    console.log(`User session stored with ID: ${userId}`)
    return userId
  } catch (err) {
    console.error(`Error handling user login (userID ${userId}): ${err.message}`)
  }
}
```

This ensures that every new user is recorded in Supabase.

## 4. Clerk Authentication Features

### 4.1 Email Verification Code Login
1. Clerk automatically sends a one-time code to the user’s email.
2. The user enters the code to authenticate and gain access.

### 4.2 Session Management
1. Clerk automatically manages user sessions.
2. Users remain logged in unless they manually log out or the session expires

### 4.3 Signed In & Signed Out Components

Clerk provides simple conditional rendering for authentication-based UI elements:

```
import { SignedIn, SignedOut } from '@clerk/clerk-react';

<SignedIn>
  <p>Welcome, you are signed in!</p>
</SignedIn>

<SignedOut>
  <p>Please sign in to continue.</p>
</SignedOut>
```
## 5. User Authorization & Role Management

### 5.1 Protected Routes

Certain routes require authentication. We wrap protected pages with the SignedIn component:
```
<SignedIn>
  <Route path="/dashboard" element={<Dashboard />} />
</SignedIn>
```
If a user is not signed in, they are automatically redirected to the Login Page.


### 6. User Session Handling

Clerk provides an active session object, which can be used as follows:

```
import { useAuth } from '@clerk/clerk-react';

const { sessionId, userId } = useAuth();
console.log(`Current session ID: ${sessionId}, User ID: ${userId}`);
```

1.	The app retrieves the user session from Clerk.
2.	The session is stored in localStorage for convenience.

```
localStorage.setItem('userID', userId);
    console.log(`User session stored with ID: ${userId}`);
    return userId;
```
```
const storedUserId = localStorage.getItem("userID");
```





### 7. Logout Handling

Clerk provides a built-in profile dropdown menu with a sign-out option:

```
import { UserButton } from '@clerk/clerk-react';

<UserButton />;
```

By default, a small profile icon appears in the top left of the app, allowing users to log out.

### 8. Advanced Database Setup with Supabase

The database schema includes tables for users, roles, projects, and institutions. Key relationships:

1. Users are stored in Supabase with a unique ID.
2. Institutions store organizational details.
3. Projects are linked to institutions and users.
4. UserRoles define access levels.

#### Example Schema:

```
CREATE TABLE Users (
  userID BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  firstName VARCHAR,
  lastName VARCHAR,
  email VARCHAR UNIQUE NOT NULL,
  username VARCHAR
);

CREATE TABLE Projects (
  projectID BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  principalInvestigatorID BIGINT REFERENCES Users(userID),
  projectName TEXT NOT NULL,
  projectAcronym TEXT
);

CREATE TABLE UserInstitutionProject (
  userInstitutionProjectID BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  userID BIGINT REFERENCES Users(userID),
  institutionID BIGINT,
  roleID BIGINT,
  projectID BIGINT REFERENCES Projects(projectID)
);

```

This allows advanced permissions and access control.

### 9. Troubleshooting

#### Issue: User Not Found in Database
Ensure the Supabase "Users" table exists.
Check that the email verification process is complete.

#### Issue: User Can't Login
Verify the user’s email verification status in the Clerk dashboard.
Ensure the user's email exists in Clerk and Supabase.

### 10. Summary

Clerk handles authentication (login/signup).
Supabase stores user records and manages roles.
Email verification codes are used for login.
Protected routes restrict access based on authentication and roles.
Session management ensures users remain logged in.

This manual provides everything needed to implement a secure authentication and user management system using Clerk and Supabase.

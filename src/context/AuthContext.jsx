import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { supabase } from "../supabaseClient";


// =========================
// AUTH CONTEXT
// =========================

const AuthContext = createContext();


// =========================
// AUTH PROVIDER
// =========================

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);


  // =========================
  // LOAD PROFILE
  // =========================

  const loadProfile = async (authUser) => {

    if (!authUser) {

      setUser(null);

      return;

    }


    try {

      const {
        data: profile,
        error
      } = await supabase
        .from("profiles")
        .select("*")
        .eq(
          "id",
          authUser.id
        )
        .maybeSingle();


      if (error) {

        console.log(
          "Profile loading error:",
          error
        );


        // Keep authenticated user
        // even if profile cannot load

        setUser({

          id:
            authUser.id,

          email:
            authUser.email,

          name:
            authUser.user_metadata?.name || ""

        });

        return;

      }


      if (profile) {

        setUser(profile);

      } else {

        setUser({

          id:
            authUser.id,

          email:
            authUser.email,

          name:
            authUser.user_metadata?.name || ""

        });

      }

    } catch (error) {

      console.log(
        "Load profile error:",
        error
      );


      // Keep the user logged in
      // even if profile loading fails

      setUser({

        id:
          authUser.id,

        email:
          authUser.email,

        name:
          authUser.user_metadata?.name || ""

      });

    }

  };


  // =========================
  // CHECK CURRENT SESSION
  // =========================

  useEffect(() => {

    let mounted = true;


    const loadUser = async () => {

      try {

        const {
          data,
          error
        } =
          await supabase.auth.getSession();


        if (error) {

          console.log(
            "Session error:",
            error
          );


          if (mounted) {

            setUser(null);

          }

          return;

        }


        const session =
          data?.session;


        // =========================
        // NO SESSION
        // =========================

        if (!session) {

          if (mounted) {

            setUser(null);

          }

          return;

        }


        // =========================
        // SESSION EXISTS
        // =========================

        await loadProfile(
          session.user
        );

      } catch (error) {

        console.log(
          "Load user error:",
          error
        );


        if (mounted) {

          setUser(null);

        }

      } finally {

        if (mounted) {

          setLoading(false);

        }

      }

    };


    loadUser();


    // =========================
    // AUTH STATE LISTENER
    // =========================

    const {
      data: authListener
    } =
      supabase.auth.onAuthStateChange(
        async (
          event,
          session
        ) => {

          if (!mounted) {

            return;

          }


          // =========================
          // LOGGED OUT
          // =========================

          if (!session) {

            setUser(null);

            setLoading(false);

            return;

          }


          // =========================
          // LOGGED IN
          // =========================

          await loadProfile(
            session.user
          );


          setLoading(false);

        }
      );


    // =========================
    // CLEANUP
    // =========================

    return () => {

      mounted = false;

      authListener
        ?.subscription
        ?.unsubscribe();

    };

  }, []);


  // =========================
  // REGISTER
  // =========================

  const register = async ({
    name,
    email,
    password
  }) => {

    try {

      const cleanName =
        name.trim();

      const cleanEmail =
        email
          .trim()
          .toLowerCase();


      // =========================
      // VALIDATION
      // =========================

      if (!cleanName) {

        return {

          success: false,

          message:
            "Please enter your name."

        };

      }


      if (!cleanEmail) {

        return {

          success: false,

          message:
            "Please enter your email."

        };

      }


      if (!password) {

        return {

          success: false,

          message:
            "Please enter a password."

        };

      }


      if (password.length < 6) {

        return {

          success: false,

          message:
            "Password must be at least 6 characters."

        };

      }


      // =========================
      // CREATE AUTH ACCOUNT
      // =========================

      const {
        data,
        error
      } =
        await supabase.auth.signUp({

          email:
            cleanEmail,

          password,

          options: {

            data: {

              name:
                cleanName

            }

          }

        });


      if (error) {

        return {

          success: false,

          message:
            error.message

        };

      }


      if (!data?.user) {

        return {

          success: false,

          message:
            "Account could not be created."

        };

      }


      // =========================
      // CREATE PROFILE
      // =========================

      const {
        data: profile,
        error: profileError
      } =
        await supabase
          .from("profiles")
          .insert({

            id:
              data.user.id,

            name:
              cleanName,

            email:
              cleanEmail

          })
          .select()
          .single();


      if (profileError) {

        console.log(
          "Profile creation error:",
          profileError
        );


        return {

          success: false,

          message:
            profileError.message

        };

      }


      // =========================
      // SAVE USER
      // =========================

      setUser(profile);


      return {

        success: true,

        user:
          profile

      };

    } catch (error) {

      console.log(
        "Registration error:",
        error
      );


      return {

        success: false,

        message:
          "Something went wrong while creating your account."

      };

    }

  };


  // =========================
  // LOGIN
  // =========================

  const login = async (
    email,
    password
  ) => {

    try {

      const cleanEmail =
        email
          .trim()
          .toLowerCase();


      const {
        data,
        error
      } =
        await supabase.auth.signInWithPassword({

          email:
            cleanEmail,

          password

        });


      if (error) {

        return {

          success: false,

          message:
            "Invalid email or password."

        };

      }


      if (!data?.user) {

        return {

          success: false,

          message:
            "Unable to log in."

        };

      }


      // =========================
      // LOAD PROFILE
      // =========================

      const {
        data: profile,
        error: profileError
      } =
        await supabase
          .from("profiles")
          .select("*")
          .eq(
            "id",
            data.user.id
          )
          .maybeSingle();


      if (profileError) {

        console.log(
          "Profile loading error:",
          profileError
        );


        setUser({

          id:
            data.user.id,

          email:
            data.user.email,

          name:
            data.user.user_metadata?.name || ""

        });

      } else if (profile) {

        setUser(profile);

      } else {

        setUser({

          id:
            data.user.id,

          email:
            data.user.email,

          name:
            data.user.user_metadata?.name || ""

        });

      }


      return {

        success: true

      };

    } catch (error) {

      console.log(
        "Login error:",
        error
      );


      return {

        success: false,

        message:
          "Something went wrong while logging in."

      };

    }

  };


  // =========================
  // LOGOUT
  // =========================

  const logout = async () => {

    try {

      const {
        error
      } =
        await supabase.auth.signOut();


      if (error) {

        console.log(
          "Logout error:",
          error
        );


        return {

          success: false,

          message:
            error.message

        };

      }


      setUser(null);


      return {

        success: true

      };

    } catch (error) {

      console.log(
        "Logout error:",
        error
      );


      return {

        success: false,

        message:
          "Could not log out."

      };

    }

  };


  // =========================
  // UPDATE PROFILE
  // =========================

  const updateProfile = async (
    updatedUser
  ) => {

    try {

      if (!user?.id) {

        return {

          success: false,

          message:
            "No logged-in user."

        };

      }


      const cleanName =
        updatedUser.name?.trim();


      const cleanEmail =
        updatedUser.email
          ?.trim()
          .toLowerCase();


      // =========================
      // VALIDATION
      // =========================

      if (!cleanName) {

        return {

          success: false,

          message:
            "Please enter your name."

        };

      }


      if (!cleanEmail) {

        return {

          success: false,

          message:
            "Please enter your email."

        };

      }


      // =========================
      // UPDATE PROFILE TABLE
      // =========================

      const {
        data: updatedProfile,
        error
      } =
        await supabase
          .from("profiles")
          .update({

            name:
              cleanName,

            email:
              cleanEmail

          })
          .eq(
            "id",
            user.id
          )
          .select()
          .single();


      if (error) {

        console.log(
          "Update profile error:",
          error
        );


        return {

          success: false,

          message:
            error.message

        };

      }


      // =========================
      // UPDATE AUTH EMAIL
      // =========================

      if (
        cleanEmail !==
        user.email
      ) {

        const {
          error:
            emailError
        } =
          await supabase.auth.updateUser({

            email:
              cleanEmail

          });


        if (emailError) {

          console.log(
            "Auth email update error:",
            emailError
          );


          return {

            success: false,

            message:
              emailError.message

          };

        }

      }


      // =========================
      // UPDATE LOCAL USER
      // =========================

      setUser(
        updatedProfile
      );


      return {

        success: true,

        user:
          updatedProfile

      };

    } catch (error) {

      console.log(
        "Profile update error:",
        error
      );


      return {

        success: false,

        message:
          "Could not update profile."

      };

    }

  };


  // =========================
  // CONTEXT
  // =========================

  return (

    <AuthContext.Provider
      value={{

        user,

        loading,

        register,

        login,

        logout,

        updateProfile

      }}
    >

      {children}

    </AuthContext.Provider>

  );

}


// =========================
// USE AUTH
// =========================

export function useAuth() {

  return useContext(
    AuthContext
  );

}
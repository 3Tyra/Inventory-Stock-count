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

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  // =========================
  // LOAD CURRENT USER
  // =========================

  useEffect(() => {

    const loadUser = async () => {

      try {

        const {
          data: {
            session
          }
        } =
          await supabase.auth.getSession();


        if (!session) {

          setUser(null);

          setLoading(false);

          return;

        }


        // Get profile

        const {
          data: profile,
          error
        } =
          await supabase
            .from("profiles")
            .select("*")
            .eq(
              "id",
              session.user.id
            )
            .single();


        if (error) {

          console.log(
            "Profile error:",
            error
          );

          setUser({
            id:
              session.user.id,

            email:
              session.user.email
          });

        } else {

          setUser(profile);

        }

      } catch (error) {

        console.log(
          "Load user error:",
          error
        );

        setUser(null);

      } finally {

        setLoading(false);

      }

    };


    loadUser();


    // Listen for login/logout

    const {
      data: authListener
    } =
      supabase.auth.onAuthStateChange(
        async (
          event,
          session
        ) => {

          if (!session) {

            setUser(null);

            return;

          }


          const {
            data: profile
          } =
            await supabase
              .from("profiles")
              .select("*")
              .eq(
                "id",
                session.user.id
              )
              .single();


          if (profile) {

            setUser(profile);

          } else {

            setUser({

              id:
                session.user.id,

              email:
                session.user.email

            });

          }

        }
      );


    return () => {

      authListener
        .subscription
        .unsubscribe();

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

      // Create Supabase account

      const {
        data,
        error
      } =
        await supabase.auth.signUp({

          email:
            email.trim(),

          password

        });


      if (error) {

        return {

          success: false,

          message:
            error.message

        };

      }


      if (!data.user) {

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
              name.trim(),

            email:
              email.trim()

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


      // Save current user

      setUser(profile);


      return {

        success: true,

        user: profile

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

      const {
        data,
        error
      } =
        await supabase.auth.signInWithPassword({

          email:
            email.trim(),

          password

        });


      if (error) {

        return {

          success: false,

          message:
            "Invalid email or password."

        };

      }


      if (!data.user) {

        return {

          success: false,

          message:
            "Unable to log in."

        };

      }


      // =========================
      // GET PROFILE
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
          .single();


      if (profileError) {

        console.log(
          "Profile loading error:",
          profileError
        );


        setUser({

          id:
            data.user.id,

          email:
            data.user.email

        });

      } else {

        setUser(profile);

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

      await supabase.auth.signOut();

      setUser(null);

    } catch (error) {

      console.log(
        "Logout error:",
        error
      );

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


      const {
        data: updatedProfile,
        error
      } =
        await supabase
          .from("profiles")
          .update({

            name:
              updatedUser.name,

            email:
              updatedUser.email

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


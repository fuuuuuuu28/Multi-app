import { SignInButton, useAuth } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useChatStore } from "../stores/useChatStore";

const useAxiosAuth = () => {
  const { getToken, signOut } = useAuth();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await getToken();

        if (!token) {
          console.warn("Token not found, forcing logout...");
          await signOut();     // buộc logout
          return Promise.reject("No token found");
        }

        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosInstance.interceptors.request.eject(interceptor);
    };
  }, [getToken]);
};

const Authorization = ({ children }: { children: React.ReactNode }) => {
  const { userId, isSignedIn, getToken } = useAuth();
  const { initialSocket, disconnected } = useChatStore();

  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  useAxiosAuth();

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      setTokenValid(!!token);
    };

    checkToken();
  }, [getToken]);

  useEffect(() => {
    if (userId || isSignedIn) {  
      initialSocket(userId);
    }

    return () => disconnected();
  }, [userId, isSignedIn]);

  if (!isSignedIn || !userId || tokenValid === false) {
    return (
      <div className="min-w-screen h-screen bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center ">
        <SignInButton>
          <button className="w-[300px] h-[130px] text-3xl px-4 py-2 bg-black text-white rounded-lg hover:cursor-pointer">
            Sign In
          </button>
        </SignInButton>
      </div>
    );
  }

  return <div>{children}</div>;
};

export default Authorization;

import { useAuth } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useChatStore } from "../stores/useChatStore";

const useAxiosAuth = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await getToken(); // luôn lấy token mới
        if (token) {
          // console.log("token",token)
          config.headers.Authorization = `Bearer ${token}`;
        }
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
  const { userId, isSignedIn } = useAuth();
  const { initialSocket, disconnected } = useChatStore();

  const [isLoading] = useState(false);
  useAxiosAuth();

  useEffect(() => {
    // setIsLoading(true);
    if (!userId || !isSignedIn) return;

    initialSocket(userId); // socket vẫn dùng userId để identify
    return () => disconnected();
  }, [userId, isSignedIn]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="size-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  // if (!isSignedIn) {
  //   return (
  //     <div className="h-screen w-full flex items-center justify-center">
  //       <SignInButton>
  //         <button> Sign In</button>
  //       </SignInButton>
  //     </div>
  //   );
  // }
  return <div>{children}</div>;
};

export default Authorization;

import { useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";

const Authentication = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  useEffect(() => {
    if(!user || !isLoaded) return;
    const syncAuth = async () => {
      try {
        await axiosInstance.post("/user/clerkProvider", {
          clerkId: user?.id,
          fullName: user?.fullName,
          image: user?.imageUrl,
        });
        console.log("successs")
      } catch (error: any) {
        console.log("authentication error: ", error.message);
      } finally {
        navigate("/");
      }
    };
    syncAuth();
  }, [isLoaded, user]);
  return (
    <div className="min-w-screen h-screen bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center py-12">
      <div className="w-[90%] h-full bg-zinc-200 border-x-blue-500 boder-y-pink-500 rounded-2xl flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading</h1>
      </div>
    </div>
  );
};

export default Authentication;

"use client";

import useFcmToken from "@/app/hooks/useFcmToken";
import { useEffect } from "react";
import { toast } from "sonner";

interface Props {
  userEmail: string;
}

export default function NotificationHandler({ userEmail }: Props) {
  const { token, notificationPermissionStatus } = useFcmToken(userEmail);

  useEffect(() => {
    const sendWelcomeNotification = async () => {
      if (!token) return;

      try {
        const response = await fetch("/api/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            title: "Welcome to Go Green",
            message: "Let's find the nearest Garbage Bin!",
            link: "/",
          }),
        });
        const data = await response.json();
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (notificationPermissionStatus === "granted") {
      sendWelcomeNotification();
    } else if (notificationPermissionStatus === "denied") {
      toast.error("Please enable notifications in your browser settings to receive welcome messages.");
    }
  }, [token, notificationPermissionStatus]);

  return null;
}

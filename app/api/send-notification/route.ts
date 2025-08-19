import admin from "firebase-admin";
import { Message } from "firebase-admin/messaging";
import { NextRequest, NextResponse } from "next/server";

  // const serviceAccountPath = path.join(process.cwd(), "/service_key.json");

if (!admin.apps.length) {
  // const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
  serviceAccount.private_key = serviceAccount.private_key
      .replace(/\\n/g, '\n')
      .trim();
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function POST(request: NextRequest) {
  const { token, title, message, link } = await request.json();

  const payload: Message = {
    token,
    notification: {
      title: title,
      body: message,
    },
    webpush: link && {
      fcmOptions: {
        link,
      },
    },
  };

  try {
    await admin.messaging().send(payload);

    return NextResponse.json({ success: true, message: "Notification sent!" });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}

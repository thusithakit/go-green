import { auth } from "@/auth";
import LoadingIndicator from "@/components/LoadingIndicator";
import SignUpButton from "@/components/SignUpButton";
import UserPoints from "@/components/UserPoints";
import { Suspense } from "react";

const page = async () => {
    const session = await auth();
    const userEmail = session?.user?.email;
    if (!session || !session?.user) {
    return <SignUpButton callbackUrl="/profile" />
    }
    return (
        <>
            <div className="mt-20 px-5">
                <div className="text-2xl mb-5">Hello, {session?.user.name}!</div>
                {userEmail && (
                    <Suspense fallback={<LoadingIndicator/>}>
                        <UserPoints userEmail={userEmail}/>
                    </Suspense>
                )}
            </div>
        </>
    )
}

export default page
import { auth } from "@/auth";
import UserPoints from "@/components/UserPoints";
import { Suspense } from "react";

const page = async () => {
    const session = await auth();
    const userEmail = session?.user?.email;
    return (
        <>
            <div className="mt-20 px-5">
                <div className="text-2xl mb-5">Hello, {session?.user.name}!</div>
                {userEmail && (
                    <Suspense fallback="Loading.....">
                        <UserPoints userEmail={userEmail}/>
                    </Suspense>
                )}
            </div>
        </>
    )
}

export default page
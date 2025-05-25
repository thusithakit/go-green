import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import NextAuth from "next-auth";
import { db } from "@/app/lib/firebase";

declare module "next-auth" {

    interface Session {
        user: {
            name: string;
            email: string;
            image: string;
            nic?: string;
            role: string;
        };
    }
}
import { doc, getDoc, setDoc } from "firebase/firestore";


export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [GitHub, Google],
    callbacks: {
        async jwt({ token }) {
            if (token) {
                try {
                    if (!token.email) throw new Error("User email is missing");
                    const userRef = doc(db, 'users', token.email);
                    const userDoc = await getDoc(userRef);

                    if (!userDoc.exists()) {
                        await setDoc(userRef, {
                            email: token.email,
                            name: token.name,
                            role: "user",
                            nic: null,
                            credits: 0,
                            createdAt: new Date(),
                        });
                        console.log('User created in Firestore');
                        token = {
                            ...token,
                            role: "user",
                            nic: null,
                            credits: 0,
                        }
                    } else {
                        token = {
                            ...token,
                            role: userDoc.data().role,
                            nic: userDoc.data().nic,
                            credits: userDoc.data().credits,
                        }
                    }
                } catch (error) {
                    console.error('Error saving user to Firestore:', error);
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (token.email && token.name && token.picture) {
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.image = token.picture;
            }
            return {
                ...session,
                user: { ...session.user, nic: token.nic, role: token.role }
            };
        },
        // async redirect({ url, baseUrl }) {
        //     return `${baseUrl}/profile/complete-profile`;
        // },
    },

    session: {
        strategy: 'jwt',
    },
    pages: { signIn: "/login" },
})
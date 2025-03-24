"use client"

import { login } from "@/app/lib/actions/auth"
import { Button } from './ui/button'

interface SignUpButtonProps {
    callbackUrl: string
}

const SignUpButton: React.FC<SignUpButtonProps> = ({ callbackUrl }) => {
    return (
        <div className="pt-[100px] flex flex-col gap-[40px] flex-wrap content-center justify-center">
            <Button onClick={() => login("github", callbackUrl)}>Sign In using Github</Button>
            <Button onClick={() => login("google", callbackUrl)}>Sign In using Google</Button>
        </div>
    )
}

export default SignUpButton
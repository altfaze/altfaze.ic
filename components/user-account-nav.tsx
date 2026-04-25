"use client"

import Link from "next/link"
import { User } from "next-auth"
import { signOut, useSession } from "next-auth/react"
import { useState } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "./UserAvatar"
import { Icons } from "./icons"
import { useToast } from "@/hooks/use-toast"

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email">
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isAvailable, setIsAvailable] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const isFreelancer = session?.user?.role === "FREELANCER"

  const toggleAvailability = async () => {
    try {
      setIsUpdating(true)
      const response = await fetch("/api/freelancers/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !isAvailable }),
      })

      if (!response.ok) {
        throw new Error("Failed to update availability")
      }

      setIsAvailable(!isAvailable)
      toast({
        title: "Success",
        description: `You are now ${!isAvailable ? "visible" : "hidden"} to clients`,
      })
    } catch (error) {
      console.error("Error updating availability:", error)
      toast({
        title: "Error",
        description: "Failed to update availability status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{ name: user.name || null, image: user.image || null }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        
        {/* Availability Toggle for Freelancers */}
        {isFreelancer && (
          <>
            <DropdownMenuItem onClick={toggleAvailability} disabled={isUpdating}>
              <div className="flex items-center gap-2 w-full">
                <div className={`h-2 w-2 rounded-full ${isAvailable ? "bg-green-500" : "bg-gray-400"}`}></div>
                <span>{isAvailable ? "Visible to Clients" : "Hidden from Clients"}</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault()
            signOut({
              callbackUrl: `${window.location.origin}/login`,
            })
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
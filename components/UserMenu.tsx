"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import Image from "next/image";

interface UserMenuProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default function UserMenu({ name, email, image }: UserMenuProps) {
  return (
    <div className="flex items-center gap-2.5">
      {image ? (
        <Image
          src={image}
          alt={name ?? "User"}
          width={28}
          height={28}
          className="rounded-full ring-2 ring-violet-200 dark:ring-violet-800"
        />
      ) : (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
          {name?.[0]?.toUpperCase() ?? "U"}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="truncate text-xs font-semibold text-stone-700 dark:text-stone-300">{name}</p>
        <p className="truncate text-[10px] text-stone-400">{email}</p>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        title="Sign out"
        className="rounded-lg p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
      >
        <LogOut size={14} />
      </button>
    </div>
  );
}

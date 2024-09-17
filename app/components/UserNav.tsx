import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DoorClosed, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";

export const navItems = [{ name: "Home", href: "/dashboard", icon: Home }];

export default function UserNav({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarFallback>{name.slice(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {navItems.map((item, index) => (
            <DropdownMenuItem asChild key={index}>
              <Link
                href={item.href}
                className="w-full flex items-center justify-between"
              >
                {item.name}
                <span>
                  <item.icon className="h-4 w-4" />
                </span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className="w-full flex justify-between items-center"
        >
          <LogoutLink>
            Logout{" "}
            <span>
              <DoorClosed className="h-4 w-4" />
            </span>
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { Button } from "@/components/ui/button";
import { Edit, File } from "lucide-react";

import Link from "next/link";
import prisma from "../lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Card } from "@/components/ui/card";
import { TrashDelete } from "../components/Submitbuttons";
import { revalidatePath } from "next/cache";
import Search from "../components/Search";

async function getData(userId: string, query: string) {
  const data = await prisma.note.findMany({
    where: {
      userId,
      title: {
        contains: query,
        mode: "insensitive",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  const query = searchParams?.query || "";
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string, query);
  async function deleteNote(formData: FormData) {
    "use server";

    const noteId = formData.get("noteId") as string;

    try {
      await prisma.note.delete({
        where: {
          id: noteId,
        },
      });
    } catch (e) {
      return e;
    }

    revalidatePath("/dasboard");
  }

  return (
    <div className="grid items-start gap-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl">Your Notes</h1>
          <p className="text-lg text-muted-foreground">
            Here you can see and create new notes
          </p>
        </div>

        <Button asChild>
          <Link href="/dashboard/new">Create a new Note</Link>
        </Button>
      </div>
      <div className="max-w-[400px]">
        <Search />
      </div>
      {data.length < 1 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <File className="w-10 h-10 text-primary" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">No notes found</h2>
          <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
            Please create some so that you can see them right here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-y-4">
          {data?.map((item) => (
            <Card
              key={item.id}
              className="flex items-center justify-between p-4"
            >
              <div>
                <h2 className="font-semibold text-xl text-primary">
                  {item.title}
                </h2>
                <p className="line-clamp-1">{item.content}</p>
                <p className="text-sm text-muted-foreground">
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "full",
                  }).format(new Date(item.createdAt))}{" "}
                  v.{item.version}
                </p>
              </div>

              <div className="flex gap-x-4">
                <Link href={`/dashboard/new/${item.id}`}>
                  <Button variant="outline" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <form action={deleteNote}>
                  <input type="hidden" name="noteId" value={item.id} />
                  <TrashDelete />
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

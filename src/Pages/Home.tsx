import { getAllPostsWithComments } from "@/Api/post.api";
import { AddPost } from "@/components/Post/AddPost";
import { Post } from "@/components/Post/PostCard";
import { useQuery } from "react-query";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

function Home() {
  const { data: allPostsWithComments } = useQuery({
    queryKey: ["getAllPostsWithComments"],
    queryFn: getAllPostsWithComments,
  });
  const [open, setOpen] = useState(false);

  return (
    <div className="flex max-w-6xl mx-auto gap-6 p-4">
      {/* Main content */}
      <div>
        <Button onClick={() => setOpen(true)}>Add Post</Button>
        <div className="flex-1 space-y-4">
          {[...(allPostsWithComments?.data ?? [])]
            .reverse()
            .map((post, index) => (
              <Post key={post._id + index} post={post} />
            ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 hidden md:block">
        <div className="bg-white rounded-lg shadow p-4 sticky top-4">
          <h2 className="font-bold text-lg mb-4">Sidebar</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
              <span>Shortcuts</span>
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
              <div className="w-8 h-8 bg-green-500 rounded-full"></div>
              <span>Groups</span>
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
              <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
              <span>Events</span>
            </div>
          </div>
        </div>
      </div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-4 shadow-xl focus:outline-none">
            <div className="flex items-center justify-between mb-2">
              <Dialog.Title className="text-lg font-semibold">
                Add Post
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-800">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <AddPost onSuccess={() => setOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export default Home;

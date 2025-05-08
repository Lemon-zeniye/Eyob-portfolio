import { FaThumbsUp, FaComment, FaShare } from "react-icons/fa";
import { useState } from "react";
import {
  formatDateSmart,
  formatMessageTime,
  getImageUrl,
  tos,
} from "@/lib/utils";
import { useMutation, useQueryClient } from "react-query";
import { addComment, likeOrDeslike } from "@/Api/post.api";
import { PostCom } from "@/Types/post.type";
import Cookies from "js-cookie";
import { MdDelete } from "react-icons/md";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { deletePost } from "@/Api/profile.api";
import { Spinner } from "../ui/Spinner";

export function Post({ post }: { post: PostCom }) {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const queryClient = useQueryClient();
  const userId = Cookies.get("userId");
  const [open, setOpen] = useState(false);

  const { mutate: likePost } = useMutation({
    mutationFn: likeOrDeslike,
    onSuccess: () => {
      queryClient.invalidateQueries("getAllPostsWithComments");
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries("getAllPostsWithComments");
      tos.success("Success");
    },
  });

  const { mutate: addAComment } = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries("getAllPostsWithComments");
    },
  });

  const handleSendComment = (
    e: React.KeyboardEvent<HTMLInputElement>,
    postId: string,
    ownerId: string | undefined
  ) => {
    if (e.key === "Enter" && !e.shiftKey && comment !== "" && ownerId) {
      e.preventDefault();
      addAComment({
        postId: postId,
        comment: comment,
        commentedTo: ownerId,
      });
      setComment("");
    }
  };

  return (
    <div className="bg-white group  shadow p-4 relative">
      {/* Post header */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src="https://i.pravatar.cc/100?img=3"
          className="w-10 h-10 object-cover rounded-full"
          alt="User avatar"
        />
        <div>
          <h3 className="font-semibold">
            {post?.postOwner?.name ? post.postOwner.name : "Unknown User"}
          </h3>
          <p className="text-gray-500 text-sm">
            {formatDateSmart(post.postDate)} <span>.</span>{" "}
            {formatMessageTime(post.postDate)}
          </p>
        </div>
      </div>

      {/* delete iocn */}
      {post?.postOwner._id === userId && (
        <div className="opacity-0 group-hover:opacity-100 absolute top-4 right-4">
          <MdDelete
            size={24}
            className="text-red-600 cursor-pointer"
            onClick={() => setOpen(true)}
          />
        </div>
      )}

      {/* Post content */}
      <div className="mb-4">
        {post.postTitle && (
          <h2 className="text-xl font-bold mb-2">{post.postTitle}</h2>
        )}
        <p className="text-gray-800">{post.postContent}</p>
      </div>

      {/* Post images */}
      {post?.postPictures?.length > 0 && (
        <div className="mb-4">
          {post.postPictures.length === 1 ? (
            <img
              src={getImageUrl(post.postPictures[0])}
              alt="Post content"
              className="w-full h-auto rounded-lg"
            />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {post.postPictures.map((img, index) => (
                <img
                  key={index}
                  src={getImageUrl(img)}
                  alt={`Post content ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post stats */}
      <div className="flex justify-between text-gray-500 text-sm border-b border-gray-200 pb-2 mb-2">
        <div className="flex items-center gap-1">
          <div className="bg-primary text-white rounded-full p-1">
            <FaThumbsUp size={10} />
          </div>
          <span>{post.likesCount}</span>
        </div>
        <div>
          <span>{post?.comments && post?.comments.length} comments</span>
        </div>
      </div>

      {/* Post actions */}
      <div className="flex justify-between text-gray-500 text-center border-b border-gray-200 pb-2 mb-4">
        <button
          className={`flex items-center justify-center gap-2 w-full py-2 hover:bg-gray-100 rounded ${
            post.isLikedByUser ? "text-primary" : ""
          } `}
          onClick={() =>
            likePost({
              like: post.isLikedByUser ? "dislike" : "like",
              postId: post._id,
            })
          }
        >
          <FaThumbsUp />
          <span>Like</span>
        </button>
        <button
          className="flex items-center justify-center gap-2 w-full py-2 hover:bg-gray-100 rounded"
          onClick={() => setShowComments(!showComments)}
        >
          <FaComment />
          <span>Comment</span>
        </button>
        <button className="flex items-center justify-center gap-2 w-full py-2 hover:bg-gray-100 rounded">
          <FaShare />
          <span>Share</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="space-y-4">
          {/* Comment input */}
          <div className="flex gap-2">
            <img
              src="https://i.pravatar.cc/100?img=5"
              className="w-8 h-8 object-cover rounded-full"
              alt="User avatar"
            />
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) =>
                  handleSendComment(e, post._id, post?.postOwner?._id)
                }
                className="w-full bg-transparent border-none outline-none"
              />
            </div>
          </div>

          {/* Existing comments */}
          {post.comments?.map((comment) => (
            <div key={comment._id} className="flex gap-2">
              <img
                src="https://i.pravatar.cc/100?img=1"
                className="w-8 h-8 object-cover rounded-full"
                alt="Commenter avatar"
              />
              <div className="flex-1 border p-2">
                <div className="font-semibold">
                  {
                    post.commenterDetails?.find(
                      (com) => com._id === comment.commentedBy
                    )?.name
                  }
                </div>
                <div>{comment.comment}</div>
                <div className="flex gap-4 text-xs text-gray-500 mt-1">
                  <span>
                    {formatDateSmart(comment.createdAt)} at{" "}
                    {formatMessageTime(comment.createdAt)}
                  </span>
                  <button>Like</button>
                  <button>Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[94%] md:w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-4 shadow-xl focus:outline-none">
            <div className="flex items-center justify-between mb-2">
              <Dialog.Title className="text-lg font-semibold">
                Delete Post
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-800">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <p>Are you sure you went to delete this post! </p>
            <div className="flex gap-2 mt-4 justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-400"
                onClick={() => mutate(post._id)}
              >
                {isLoading ? <Spinner /> : "Submit"}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

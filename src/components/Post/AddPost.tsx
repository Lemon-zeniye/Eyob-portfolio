import { createPost } from "@/Api/profile.api";
import { tos } from "@/lib/utils";
import { useState, useRef, ChangeEvent } from "react";
import {
  FaImage,
  FaTimes,
  // FaThumbsUp,
  // FaComment,
  // FaShare,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { useMutation, useQueryClient } from "react-query";
import { Spinner } from "../ui/Spinner";
import { useRole } from "@/Context/RoleContext";
import Cookies from "js-cookie";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// import { FiUploadCloud } from "react-icons/fi";

export const AddPost = ({ onSuccess }: { onSuccess: () => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const profileImage = Cookies.get("profilePic");
  const userName = Cookies.get("userName");
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + images.length > 10) {
        alert("You can upload a maximum of 10 images");
        return;
      }

      setImages([...images, ...files]);

      // Create previews
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };
  const { mode } = useRole();

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries(["getAllPostsWithComments", 1, 5, mode]);
      tos.success("Success");
    },
  });

  const handleSubmit = () => {
    if (!title.trim() && !description.trim() && images.length === 0) {
      tos.error("Please add content to your post");
      return;
    }

    const formData = new FormData();
    if (title) formData.append("postTitle", title);
    if (description) formData.append("postContent", description);
    // formal
    const postType = mode === "formal" ? "formal" : "social";
    formData.append("postType", postType);

    // Append images one by one
    images.forEach((file) => {
      formData.append("postImages", file);
    });

    // Call mutation with FormData
    mutate(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden min-h-[50vh] max-h-[78vh] overflow-y-auto border border-gray-100">
      {/* Post creator header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <Avatar className={`w-full h-full ring-2 bg-white`}>
              <AvatarImage
                src={profileImage}
                alt={userName}
                className="object-cover"
              />
              <AvatarFallback className="text-primary bg-white font-medium">
                {userName && userName?.slice(0, 1)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <span className="font-medium text-gray-800">You</span>
        </div>
      </div>

      {/* Post content */}
      <div className="p-5">
        <input
          type="text"
          placeholder="Add a title (optional)"
          className="w-full text-xl font-semibold mb-3 outline-none placeholder-gray-400 focus:placeholder-gray-300 transition-colors"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="What's on your mind?"
          className="w-full min-h-[100px] outline-none resize-none placeholder-gray-400 focus:placeholder-gray-300 text-gray-700 leading-relaxed transition-colors"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Image previews */}
      {imagePreviews.length > 0 && (
        <div
          className={`px-5 pb-5 ${
            imagePreviews.length > 1
              ? "flex md:grid md:grid-cols-2 gap-3 overflow-x-auto"
              : ""
          }`}
        >
          {/* Horizontal scroll on mobile */}
          {/* <div className={`flex md:grid  gap-3 overflow-x-auto`}> */}
          {imagePreviews.map((preview, index) => (
            <div
              key={index}
              className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-100 min-w-[250px] max-w-[90%] md:min-w-0"
            >
              <img
                src={preview}
                alt={`Preview ${index}`}
                className={`${
                  imagePreviews.length === 1
                    ? "w-full"
                    : "h-48 w-full object-cover"
                }`}
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              >
                <FaTimes size={14} />
              </button>
            </div>
          ))}
          {/* </div> */}
        </div>
      )}

      {/* Post actions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600  hover:bg-gray-100 transition-colors ${
              mode === "formal" ? "hover:text-primary" : "hover:text-[#FFA500]"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <FaImage
              className={`text-lg ${
                mode === "formal" ? "text-primary" : "text-[#FFA500]"
              }`}
            />
            <span className="text-sm font-medium">Photo</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            multiple
            accept="image/*"
            className="hidden"
          />
        </div>
        <button
          className={`px-5 py-2.5 rounded-lg text-white font-medium flex items-center space-x-2 transition-colors shadow-sm ${
            !description && !title && imagePreviews.length === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }

          ${
            mode === "formal"
              ? " bg-primary hover:bg-primary/90"
              : " bg-[#FFA500] hover:bg-[#FFA500]/90"
          }
          
          
          `}
          onClick={handleSubmit}
          disabled={!description && !title && imagePreviews.length === 0}
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <span>Post</span>
              <FiSend className="text-lg" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

{
  /* Sample post interactions (optional) */
}
{
  /* <div className="border-t p-2 hidden">
        <div className="flex justify-between text-gray-500 text-sm px-2 py-1">
          <span>0 likes</span>
          <span>0 comments</span>
        </div>
        <div className="grid grid-cols-3 border-t">
          <button className="flex items-center justify-center space-x-2 py-2 hover:bg-gray-100 text-gray-500">
            <FaThumbsUp />
            <span>Like</span>
          </button>
          <button className="flex items-center justify-center space-x-2 py-2 hover:bg-gray-100 text-gray-500">
            <FaComment />
            <span>Comment</span>
          </button>
          <button className="flex items-center justify-center space-x-2 py-2 hover:bg-gray-100 text-gray-500">
            <FaShare />
            <span>Share</span>
          </button>
        </div>
      </div> */
}

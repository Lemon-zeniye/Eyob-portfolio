import { createPost } from "@/Api/profile.api";
import { tos } from "@/lib/utils";
import { useState, useRef, ChangeEvent } from "react";
import {
  FaImage,
  FaTimes,
  FaEllipsisH,
  FaThumbsUp,
  FaComment,
  FaShare,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { useMutation, useQueryClient } from "react-query";

export const AddPost = ({ onSuccess }: { onSuccess: () => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
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

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const { mutate } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries("getAllPostsWithComments");
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

    // Append images one by one
    images.forEach((file) => {
      formData.append("postImages", file);
    });

    // Call mutation with FormData
    mutate(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Post creator header */}
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src="https://i.pravatar.cc/150?img=3"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <FaEllipsisH />
        </button>
      </div>

      {/* Post content */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Title (optional)"
          className="w-full text-lg font-semibold mb-2 outline-none placeholder-gray-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="What's on your mind?"
          className="w-full min-h-[100px] outline-none resize-none placeholder-gray-400"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Image previews */}
      {imagePreviews.length > 0 && (
        <div
          className={`p-4 border-t ${
            imagePreviews.length > 1 ? "grid grid-cols-2 gap-2" : ""
          }`}
        >
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index}`}
                className={`rounded-lg ${
                  imagePreviews.length === 1
                    ? "w-full"
                    : "h-40 w-full object-cover"
                }`}
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaTimes size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Post actions */}
      <div className="p-3 border-t flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
            onClick={() => fileInputRef.current?.click()}
          >
            <FaImage className={`text-lg text-primary`} />
            <span>Photo</span>
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
          className={`px-4 py-2 rounded-md text-white font-medium flex items-center space-x-2 bg-primary`}
          onClick={handleSubmit}
        >
          <span>Post</span>
          <FiSend />
        </button>
      </div>

      {/* Sample post interactions (optional) */}
      <div className="border-t p-2 hidden">
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
      </div>
    </div>
  );
};

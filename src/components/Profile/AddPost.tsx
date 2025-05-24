import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlusIcon, TrashIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "react-query";
import { createPost, updatePost } from "@/Api/profile.api";
import { Spinner } from "../ui/Spinner";
import { formatImageUrls, tos } from "@/lib/utils";
import { Post } from "@/Types/profile.type";
import { useRole } from "@/Context/RoleContext";

type PostFormProps = {
  initialData: Post | undefined;
  onSuccess: () => void;
};

function AddPost({ initialData, onSuccess }: PostFormProps) {
  const form = useForm({
    defaultValues: {
      postTitle: initialData?.postTitle ?? "",
      postContent: initialData?.postContent ?? "",
      postPictures: [] as File[],
    },
  });

  const editImages: string[] = initialData?.postPictures
    ? ([] as string[]).concat(formatImageUrls(initialData.postPictures))
    : [];

  const [imagePreviews, setImagePreviews] = useState<string[]>(editImages);
  const queryClient = useQueryClient();
  const { mode } = useRole();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    form.setValue("postPictures", files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries("singleUserPost");
      tos.success("Success");
    },
  });

  const { mutate: update, isLoading: isUpdating } = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries("singleUserPost");
      tos.success("Success");
    },
  });

  const removeImage = (index: number) => {
    const updatedImages = [...(form.getValues("postPictures") || [])];
    const updatedPreviews = [...imagePreviews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    form.setValue("postPictures", updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const onSubmit = () => {
    const values = form.getValues();

    const formData = new FormData();
    if (values.postTitle) formData.append("postTitle", values.postTitle);
    if (values.postContent) formData.append("postContent", values.postContent);
    const postType = mode === "formal" ? "formal" : "social";
    formData.append("postType", postType);

    // Append images one by one
    values.postPictures.forEach((file) => {
      formData.append("postImages", file);
    });

    // Call mutation with FormData
    if (initialData) {
      update({ id: initialData._id, payload: formData });
    } else {
      mutate(formData);
    }
  };

  return (
    <div className="w-full mt-6">
      <FormProvider {...form}>
        <form
          className="space-y-4 border border-gray-200 rounded-md p-4 bg-white shadow-sm"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="postTitle"
            rules={{ required: "Post content is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Write your post title..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postContent"
            rules={{ required: "Post content is required" }}
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Post</FormLabel> */}
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Write your post description..."
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel
              htmlFor="image-upload"
              className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
            >
              <ImagePlusIcon className="w-5 h-5" />
              <span className="text-lg">Add Images</span>
            </FormLabel>
            <FormControl>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
            </FormControl>
          </FormItem>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={src}
                    alt={`preview-${idx}`}
                    className="rounded-md object-cover w-full h-32"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                  >
                    <TrashIcon className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="w-full flex items-center justify-end">
            <Button type="submit" className="px-6">
              {isLoading || isUpdating ? (
                <Spinner />
              ) : initialData ? (
                "Edit Post"
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default AddPost;

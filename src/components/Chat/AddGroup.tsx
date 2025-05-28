import { getActiveUsers } from "@/Api/profile.api";
import { ActiveUser } from "@/Types/profile.type";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { getAxiosErrorMessage } from "@/Api/axios";
import { Spinner } from "../ui/Spinner";
import { tos } from "@/lib/utils";
import Cookies from "js-cookie";
import { useForm, FormProvider } from "react-hook-form";
import * as Select from "@radix-ui/react-select";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ChevronDownIcon } from "lucide-react";
import { createGroup } from "@/Api/chat.api";
import { UserCard } from "./UserCard";

function AddGroup({ onSuccess }: { onSuccess: () => void }) {
  const form = useForm({
    mode: "onChange",
    defaultValues: {
      groupName: "",
      groupType: "",
    },
  });
  const { data: activeUsers } = useQuery({
    queryKey: ["activeUser"],
    queryFn: getActiveUsers,
  });
  const queryClient = useQueryClient();
  const userId = Cookies.get("userId");
  const [selectedUsers, setSelectedUsers] = useState<ActiveUser[]>([]);
  const [search, setSearch] = useState("");

  const filteredUsers = activeUsers?.data.filter(
    (user) =>
      user._id !== userId &&
      user.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectUser = (user: ActiveUser) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u._id === user._id);
      return isSelected
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user];
    });
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      tos.success("Success");
      onSuccess();
      queryClient.invalidateQueries(["groups"]);
    },
    onError: (error: any) => {
      const message = getAxiosErrorMessage(error);
      tos.error(message);
    },
  });

  const submit = () => {
    form.trigger();
    if (form.formState.isValid) {
      const payload = {
        ...form.getValues(),
        members: selectedUsers?.map((u) => u._id),
      };
      mutate(payload);
    }
  };
  // ["event", "study", "social", "work", "other"]

  return (
    <div className="space-y-4">
      <FormProvider {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="groupName"
            rules={{ required: "Required" }}
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Group Name</FormLabel> */}
                <FormControl>
                  <Input {...field} placeholder="Group Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="groupType"
            rules={{
              required: "Field of study is required",
            }}
            render={({ field }) => (
              <FormItem className="w-full">
                {/* <FormLabel>Field of Study</FormLabel> */}
                <FormControl>
                  <Select.Root
                    // onValueChange={(value) => {
                    //   field.onChange(value);
                    // }}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <Select.Trigger
                      className={`flex items-center justify-between w-full h-10 px-3 border rounded-md bg-white ${
                        field.value ? "text-black" : "text-gray-500 "
                      } text-sm focus:outline-none`}
                    >
                      <Select.Value placeholder="Select Group Type" />
                      <Select.Icon>
                        <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content className="z-50 mt-1 w-[--radix-select-trigger-width] rounded-md border border-gray-200 bg-white shadow-md">
                        <Select.Viewport className="p-1">
                          {["event", "social"].map((g) => (
                            <Select.Item
                              key={g}
                              value={g}
                              className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded"
                            >
                              <Select.ItemText>{g}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </FormProvider>
      <div className="px-1">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search User..."
          className="w-full"
        />
      </div>

      <div className="h-64 overflow-y-auto pr-2 space-y-3">
        {filteredUsers?.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            selected={selectedUsers.some((u) => u._id === user._id)}
            onSelect={handleSelectUser}
          />
        ))}
        {filteredUsers && filteredUsers?.length === 0 && (
          <p className="text-center text-gray-500 py-4">No users found</p>
        )}
      </div>

      <button
        disabled={selectedUsers.length === 0}
        onClick={submit}
        className="w-full py-3 flex items-center justify-center px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {!isLoading ? (
          <>
            Create Group With {selectedUsers.length}{" "}
            {selectedUsers.length === 1 ? "Member" : "Members"}
          </>
        ) : (
          <Spinner />
        )}
      </button>
    </div>
  );
}

export default AddGroup;

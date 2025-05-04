import { Group } from "@/Types/chat.type";
import { BsExclamationCircle } from "react-icons/bs";
import { MdLink, MdMoreVert } from "react-icons/md";
import {
  FaBell,
  FaAngleDown,
  FaTrash,
  FaSignOutAlt,
  FaAngleUp,
} from "react-icons/fa";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  addMemebers,
  deleteGroup,
  getGroupMembersList,
  removeMember,
} from "@/Api/chat.api";
import { getUserFromToken, tos } from "@/lib/utils";
import { getAxiosErrorMessage } from "@/Api/axios";
import { Spinner } from "../ui/Spinner";
import Cookies from "js-cookie";
import { ActiveUser } from "@/Types/profile.type";
import { getActiveUsers } from "@/Api/profile.api";
import { Input } from "../ui/input";
import { UserCard } from "./UserCard";

// import { Switch } from "@radix-ui/themes";
// import { Avatar } from "@radix-ui/themes";

function GroupDetail({
  userGroup,
  groupDetail,
  setGroupDetail,
}: {
  userGroup: Group | undefined;
  groupDetail: boolean;
  setGroupDetail: any;
}) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const userInfo = getUserFromToken(Cookies.get("accessToken") ?? null);
  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };
  const [selectedUsers, setSelectedUsers] = useState<ActiveUser[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(true);
  const { mutate } = useMutation({
    mutationFn: removeMember,
    onSuccess: () => {
      tos.success("Success");
      queryClient.invalidateQueries(["getGroupMembersList"]);
    },
    onError: (err) => {
      const mes = getAxiosErrorMessage(err);
      tos.error(mes);
    },
  });

  const handleSelectUser = (user: ActiveUser) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u._id === user._id);
      return isSelected
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user];
    });
  };

  const { data: activeUsers } = useQuery({
    queryKey: ["activeUser"],
    queryFn: getActiveUsers,
  });

  const { data: members } = useQuery({
    queryKey: ["getGroupMembersList", userGroup?._id],
    queryFn: () => {
      if (userGroup) {
        return getGroupMembersList(userGroup._id);
      }
    },
    enabled: !!userGroup,
  });

  const membersIds = members?.data?.map((member) => member._id);

  const filteredUsers = activeUsers?.data.filter(
    (user) =>
      user._id !== userInfo?.id &&
      !membersIds?.includes(user?._id) &&
      user.name.toLowerCase().includes(search.toLowerCase())
  );

  const { mutate: delGroup, isLoading } = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      tos.success("Success");
      queryClient.invalidateQueries(["groups"]);
      setGroupDetail(false);
    },
    onError: (err) => {
      const mes = getAxiosErrorMessage(err);
      tos.error(mes);
    },
  });

  const { mutate: addMemember, isLoading: addingMemberLoading } = useMutation({
    mutationFn: addMemebers,
    onSuccess: () => {
      tos.success("Success");
      queryClient.invalidateQueries(["getGroupMembersList"]);
    },
    onError: (err) => {
      const mes = getAxiosErrorMessage(err);
      tos.error(mes);
    },
  });

  const onDelete = (memberId: string) => {
    if (userGroup) {
      mutate({
        memberId: memberId,
        groupId: userGroup?._id,
      });
    }
  };
  const deleGroup = () => {
    delGroup({ groupId: userGroup?._id });
  };

  const submit = () => {
    addMemember({
      groupId: userGroup?._id,
      memberIds: selectedUsers?.map((user) => user._id),
    });
  };

  return (
    <Dialog.Root open={groupDetail} onOpenChange={setGroupDetail}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[80%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg flex flex-col gap-6">
          <Dialog.Title className="text-lg font-semibold text-gray-900">
            <div className="">
              <h1 className="text-2xl font-bold text-gray-900">
                {userGroup?.groupName}
              </h1>
              <p className="text-sm text-gray-500">
                {userGroup?.members?.length} members
              </p>
            </div>
          </Dialog.Title>
          <div className="max-h-[80vh] overflow-y-auto p-4 text-gray-800">
            {/* Info Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">Info</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <BsExclamationCircle className="text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">
                      Description
                    </h3>
                    <p className="text-sm text-gray-500">
                      Add a group description
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MdLink className="text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">
                      Group Link
                    </h3>
                    <p className="text-sm text-blue-500 underline">
                      https://bevy.me/grouplink
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">
                Settings
              </h2>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaBell className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Notifications
                  </span>
                </div>
                {/* <Switch defaultChecked /> */}
                <span>switch</span>
              </div>
            </div>

            {/* Shared Content Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">
                Shared Content
              </h2>
              <div className="space-y-2">
                {/* Media Section */}
                <div>
                  <div
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleSection("media")}
                  >
                    <span className="text-sm font-medium text-gray-700">
                      Media
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>2 items</span>
                      {openSection === "media" ? (
                        <FaAngleUp />
                      ) : (
                        <FaAngleDown />
                      )}
                    </div>
                  </div>
                  {openSection === "media" && (
                    <div className="px-4 py-2 text-sm text-gray-600 bg-white ">
                      <div>- Photo_1.jpg</div>
                      <div>- Video_clip.mp4</div>
                    </div>
                  )}
                </div>

                {/* Files Section */}
                <div>
                  <div
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleSection("files")}
                  >
                    <span className="text-sm font-medium text-gray-700">
                      Files
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>5 items</span>
                      {openSection === "files" ? (
                        <FaAngleUp />
                      ) : (
                        <FaAngleDown />
                      )}
                    </div>
                  </div>
                  {openSection === "files" && (
                    <div className="px-4 py-2 text-sm text-gray-600 bg-white ">
                      <div>- Invoice.pdf</div>
                      <div>- Contract.docx</div>
                      <div>- Presentation.pptx</div>
                      <div>- Notes.txt</div>
                      <div>- Budget.xlsx</div>
                    </div>
                  )}
                </div>

                {/* Links Section */}
                <div>
                  <div
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleSection("links")}
                  >
                    <span className="text-sm font-medium text-gray-700">
                      Links
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>3 items</span>
                      {openSection === "links" ? (
                        <FaAngleUp />
                      ) : (
                        <FaAngleDown />
                      )}
                    </div>
                  </div>
                  {openSection === "links" && (
                    <div className="px-4 py-2 text-sm text-blue-600 bg-white ">
                      <div>
                        <a href="#">https://example.com</a>
                      </div>
                      <div>
                        <a href="#">https://another-link.com</a>
                      </div>
                      <div>
                        <a href="#">https://resource.site</a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Members Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold mb-3 text-gray-700">
                  Members
                </h2>
                <button
                  className={`${
                    open
                      ? "text-black hover:text-gray-500"
                      : "text-red-500 hover:text-red-400"
                  } `}
                  onClick={() => setOpen(!open)}
                >
                  {open ? "Add Members" : "Cancel"}
                </button>
              </div>
              {open ? (
                <div className="space-y-2 h-64 overflow-y-auto">
                  {members?.data.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          className="w-8 h-8 rounded-full object-cover"
                          src="https://i.pravatar.cc/100?img=14"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {member.name}
                          </p>
                          <p className="text-xs font-medium text-gray-500">
                            {member.email}
                          </p>
                        </div>
                        {member._id === userGroup?.createdBy && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                      {member._id !== userGroup?.createdBy && (
                        <div className="relative group inline-block text-left">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MdMoreVert />
                          </button>

                          <div className="absolute right-0 z-10 mt-0 w-28 origin-top-right rounded-md bg-white border border-gray-200 shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition duration-150 ease-in-out">
                            <button
                              onClick={() => onDelete(member._id)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="px-1">
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search User..."
                      className="w-full"
                    />
                  </div>

                  <div className="h-64 mt-2 overflow-y-auto pr-2 space-y-3">
                    {filteredUsers?.map((user) => (
                      <UserCard
                        key={user._id}
                        user={user}
                        selected={selectedUsers.some((u) => u._id === user._id)}
                        onSelect={handleSelectUser}
                      />
                    ))}
                    {filteredUsers && filteredUsers?.length === 0 && (
                      <p className="text-center text-gray-500 py-4">
                        No users found
                      </p>
                    )}
                  </div>

                  <button
                    disabled={selectedUsers.length === 0}
                    onClick={submit}
                    className="w-full py-3 flex items-center justify-center px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {!addingMemberLoading ? (
                      <>
                        Add {selectedUsers.length}{" "}
                        {selectedUsers.length === 1 ? "Member" : "Members"}
                      </>
                    ) : (
                      <Spinner />
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Danger Zone */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-gray-700">
                Danger Zone
              </h2>
              <div className="space-y-2">
                {userInfo?.id !== userGroup?.createdBy ? (
                  <button className="w-full flex items-center gap-3 p-3 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    <FaSignOutAlt />
                    <span className="text-sm font-medium">Leave Group</span>
                  </button>
                ) : (
                  <button
                    className="w-full flex items-center gap-3 p-3 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    onClick={() => {
                      deleGroup();
                    }}
                  >
                    {isLoading ? (
                      <Spinner />
                    ) : (
                      <>
                        {" "}
                        <FaTrash />
                        <span className="text-sm font-medium">
                          Delete Group
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default GroupDetail;

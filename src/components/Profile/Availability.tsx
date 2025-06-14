import { getAxiosErrorMessage } from "@/Api/axios";
import { getUserFullProfile, updateOpenToWork } from "@/Api/profile.api";
import { useRole } from "@/Context/RoleContext";
import { tos } from "@/lib/utils";
import * as Switch from "@radix-ui/react-switch";
import Cookies from "js-cookie";
import { useMutation, useQuery, useQueryClient } from "react-query";

function Availability() {
  const userId = Cookies.get("userId");
  const queryClient = useQueryClient();
  const { mode } = useRole();

  const { data: userFullProfile } = useQuery({
    queryKey: ["getUserFullProfile", userId],
    queryFn: () => {
      if (userId) {
        return getUserFullProfile(userId);
      }
    },
    enabled: !!userId,
  });

  const { mutate } = useMutation({
    mutationFn: updateOpenToWork,
    onSuccess: () => {
      tos.success("Success");
      queryClient.invalidateQueries(["getUserFullProfile", userId]);
    },
    onError: (e) => {
      const mes = getAxiosErrorMessage(e);
      tos.error(mes);
    },
  });
  const openToWork = userFullProfile?.data.openToWork ?? false;
  return (
    <div
      onClick={() => mutate()}
      className={`flex  items-center justify-between gap-4 p-4 rounded-xl bg-white shadow-sm border ${
        mode === "formal" ? "border-primary" : "border-primary2"
      } cursor-pointer`}
    >
      <p className="text-sm font-medium text-gray-700 select-none">
        Open to work opportunities?
      </p>
      <Switch.Root
        checked={openToWork}
        onCheckedChange={() => mutate()}
        onClick={(e) => e.stopPropagation()} // Prevent double toggle
        className={`w-[42px] h-[25px] rounded-full relative transition-colors duration-200 
      ${
        mode === "formal"
          ? "data-[state=checked]:bg-primary"
          : "data-[state=checked]:bg-primary2"
      } 
      bg-gray-300`}
      >
        <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-sm transition-transform duration-200 translate-x-1 data-[state=checked]:translate-x-[19px]" />
      </Switch.Root>
    </div>
  );
}

export default Availability;

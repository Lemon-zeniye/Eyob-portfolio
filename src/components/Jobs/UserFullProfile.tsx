import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useQuery } from "react-query";
import { getUserFullProfile } from "@/Api/profile.api";
import { X } from "lucide-react";
import ShareProfile from "../Profile/ShareProfile";
import Tabs from "../Tabs/TabsLine";
import ShareCompanyProfile from "../Profile/ShareCompanyProfile";
import CustomVideoPlayer from "../Video/Video";
import { formatImageUrl } from "@/lib/utils";

const UserProfile = ({
  id,
  open,
  setOpen,
  showShare,
}: {
  id: string | undefined;
  open: boolean;
  setOpen: any;
  showShare: boolean;
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const [profileImage, setprofileImage] = useState<string | undefined>(
    undefined
  );

  const { data: userFullProfile } = useQuery({
    queryKey: ["getUserFullProfile", id],
    queryFn: () => {
      if (id) {
        return getUserFullProfile(id);
      }
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (userFullProfile?.data && userFullProfile?.data?.pictures[0]?.path) {
      setprofileImage(formatImageUrl(userFullProfile?.data?.pictures[0]?.path));
    }
  }, [userFullProfile]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg flex flex-col gap-0">
          <Dialog.Title className="text-xs text-center font-semibold text-gray-900 bg-primary rounded-t-xl"></Dialog.Title>
          <div className="h-[80vh] overflow-y-auto">
            {/* Profile Header */}
            <div className="text-center mb-6">
              <div className="relative h-[20vh] rounded-t-xl mb-12">
                {/* Background Image */}
                <div className="max-h-[20vh]">
                  <CustomVideoPlayer
                    isOtherUser={true}
                    otherUser={userFullProfile?.data}
                    fromChat={true}
                  />
                </div>

                {/* Profile Image */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-indigo-100 z-10"
                  />
                </div>
                {showShare && (
                  <p
                    className="absolute -bottom-10 right-2 font-light text-primary hover:text-primary/60 cursor-pointer"
                    onClick={() => setSheetOpen(true)}
                  >
                    Share Profile
                  </p>
                )}
              </div>

              <h1 className="text-2xl font-bold text-gray-800">
                {userFullProfile?.data.name}
              </h1>
              <p className="text-primary font-medium">
                {userFullProfile?.data.position}
              </p>
              <p className="text-gray-600">{userFullProfile?.data.location}</p>
              <p className="text-gray-700 mt-2">{userFullProfile?.data.bio}</p>
            </div>

            {/* Education Section */}
            <div className="mb-6">
              <div
                className="flex justify-between items-center cursor-pointer bg-gray-50 p-3 rounded-lg"
                onClick={() => toggleSection("education")}
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  Education
                </h2>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    expandedSection === "education" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {expandedSection === "education" && (
                <div className="mt-3 space-y-4 pl-4">
                  {userFullProfile?.data.education.map((edu) => (
                    <div
                      key={edu._id}
                      className="border-l-2 border-indigo-200 pl-4 py-2"
                    >
                      <h3 className="font-medium text-gray-800">
                        {edu.degree} in {edu.fieldOfStudy}
                      </h3>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">
                        Graduated: {edu.graduationYear} • GPA: {edu.gpa}
                      </p>
                      {edu.currentlyStudying && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                          Currently Studying
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Experience Section */}
            <div className="mb-6">
              <div
                className="flex justify-between items-center cursor-pointer bg-gray-50 p-3 rounded-lg"
                onClick={() => toggleSection("experience")}
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  Experience
                </h2>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    expandedSection === "experience" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {expandedSection === "experience" && (
                <div className="mt-3 space-y-4 pl-4">
                  {userFullProfile?.data.experience.map((exp) => (
                    <div
                      key={exp._id}
                      className="border-l-2 border-indigo-200 pl-4 py-2"
                    >
                      <h3 className="font-medium text-gray-800">
                        {exp.jobTitle}
                      </h3>
                      <p className="text-gray-600">
                        {exp.entity} • {exp.employmentType}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(exp.startDate).toLocaleDateString()} -{" "}
                        {new Date(exp.endDate).toLocaleDateString()} •{" "}
                        {exp.locationType}
                      </p>
                      <p className="text-gray-700 mt-1">{exp.expDescription}</p>
                      {exp.workingAt && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                          Currently Working
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Organizations Section */}
            {userFullProfile?.data.organization &&
              userFullProfile?.data.organization.length > 0 && (
                <div className="mb-6">
                  <div
                    className="flex justify-between items-center cursor-pointer bg-gray-50 p-3 rounded-lg"
                    onClick={() => toggleSection("organization")}
                  >
                    <h2 className="text-lg font-semibold text-gray-800">
                      Organizations
                    </h2>
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform ${
                        expandedSection === "organization" ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  {expandedSection === "organization" && (
                    <div className="mt-3 space-y-4 pl-4">
                      {userFullProfile?.data.organization.map((org) => (
                        <div
                          key={org._id}
                          className="border-l-2 border-indigo-200 pl-4 py-2"
                        >
                          <h3 className="font-medium text-gray-800">
                            {org.organizationName}
                          </h3>
                          <p className="text-gray-600">
                            {org.organizationType}
                          </p>
                          <p className="text-sm text-gray-500">{org.email}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            {/* Skills Section - Empty in this case */}
            {userFullProfile?.data.skills &&
              userFullProfile?.data.skills.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {userFullProfile?.data.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full"
                      >
                        {skill.skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen} userId={id} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

function Sheet({
  open,
  onOpenChange,
  userId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | undefined;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
    } else {
      // Delay unmounting for animation
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 rounded-xl transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => onOpenChange(false)}
      />

      {/* Sheet Content */}
      <div
        className={`relative w-full max-w-xl bg-white rounded-xl shadow-xl transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "80%" }}
      >
        {/* Sheet Header */}
        <div className="sticky top-0 flex items-center justify-end ">
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-500 hover:text-gray-800 rounded-full pt-4 px-4 hover:bg-gray-100"
          >
            <X className="w-5 h-5 " />
          </button>
        </div>

        {/* Sheet Body */}
        <div className="h-[calc(100%-40px)] overflow-y-auto p-4 pt-0">
          <Tabs tabs={["Employees", "Companies"]}>
            <ShareProfile onSuccess={() => onOpenChange(false)} small={true} />
            <ShareCompanyProfile
              userId={userId}
              onSuccess={() => onOpenChange(false)}
            />
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

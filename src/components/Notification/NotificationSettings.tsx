import { useState, useEffect } from "react";
import * as Switch from "@radix-ui/react-switch";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const NotificationSettings = () => {
  const { toast } = useToast();

  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "newMessage",
      title: "New Message",
      description: "Get notified when you receive new messages",
      enabled: true,
    },
    {
      id: "newPosts",
      title: "New Posts",
      description: "Get notified about new posts from people you follow",
      enabled: true,
    },
    {
      id: "newFollowers",
      title: "New Followers",
      description: "Get notified when someone follows you",
      enabled: true,
    },
    {
      id: "interviews",
      title: "Interviews",
      description: "Get notified about interview schedules and updates",
      enabled: true,
    },
    {
      id: "jobApplicationProgress",
      title: "Job Application Progress",
      description: "Get notified about updates on your job applications",
      enabled: true,
    },
    {
      id: "suggestedJobs",
      title: "Suggested Jobs",
      description: "Get notified about jobs that match your profile",
      enabled: false,
    },
  ]);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("notificationSettings");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error("Error loading notification settings:", error);
      }
    }
  }, []);

  const handleToggle = (settingId: string) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === settingId
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const handleSave = () => {
    try {
      localStorage.setItem("notificationSettings", JSON.stringify(settings));
      toast({
        title: "Settings Saved",
        description:
          "Your notification preferences have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast({
        title: "Error",
        description:
          "Failed to save your notification settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    const defaultSettings = settings.map((setting) => ({
      ...setting,
      enabled: setting.id !== "suggestedJobs",
    }));
    setSettings(defaultSettings);
    toast({
      title: "Settings Reset",
      description: "Notification settings have been reset to default values.",
    });
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-600 rounded-lg">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Notification Settings
            </h1>
            <p className="text-gray-600">
              Manage your notification preferences
            </p>
          </div>
        </div>
        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose which notifications you'd like to receive. Changes will be
              saved when you click the Save button.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{setting.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {setting.description}
                  </p>
                </div>
                <Switch.Root
                  checked={setting.enabled}
                  onCheckedChange={() => handleToggle(setting.id)}
                  className="ml-4 w-[42px] h-[25px] bg-gray-300 rounded-full relative data-[state=checked]:bg-green-500"
                >
                  <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-1 data-[state=checked]:translate-x-[19px]" />
                </Switch.Root>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={handleReset} className="px-6">
            Reset to Default
          </Button>
          <Button
            onClick={handleSave}
            className="px-8 bg-blue-600 hover:bg-blue-700"
          >
            Save Settings
          </Button>
        </div>

        <Card className="mt-8 shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Current Settings Summary</CardTitle>
            <CardDescription>
              Quick overview of your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-green-600 mb-2">
                  Enabled Notifications
                </h4>
                <ul className="space-y-1">
                  {settings
                    .filter((setting) => setting.enabled)
                    .map((setting) => (
                      <li key={setting.id} className="text-sm text-gray-600">
                        • {setting.title}
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-red-600 mb-2">
                  Disabled Notifications
                </h4>
                <ul className="space-y-1">
                  {settings
                    .filter((setting) => !setting.enabled)
                    .map((setting) => (
                      <li key={setting.id} className="text-sm text-gray-600">
                        • {setting.title}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationSettings;

import { IoPersonSharp } from "react-icons/io5";
import { IoMdBriefcase } from "react-icons/io";
import { FaGraduationCap } from "react-icons/fa6";
import { IconType } from "react-icons/lib";
import { FormProvider, useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "../components/ui/form";
import { Button } from "../components/ui/button";
import { PhoneNumberInput } from "@/components/ui/phone-number";
import * as Select from "@radix-ui/react-select";
import { City, Country, ICity, IState, State } from "country-state-city";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { countries } from "@/lib/constant";
import { CalendarIcon } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface SingleTabProps {
  Icon: IconType;
  title: string;
  active?: boolean;
  completed?: boolean;
  isLast?: boolean;
}

const SingleTab = ({
  Icon,
  title,
  active = false,
  completed = false,
  isLast = false,
}: SingleTabProps) => {
  return (
    <div className="flex items-start gap-4 group cursor-pointer">
      <div className="flex flex-col gap-0 items-center">
        <div
          className={`flex items-center justify-center h-14 w-14 rounded-full border
          ${active || completed ? "border-primary" : "border-[#767676]"}
          transition-colors duration-300`}
        >
          <Icon
            size={24}
            className={active || completed ? "text-primary" : "text-[#767676]"}
          />
        </div>
        {!isLast && (
          <div
            className={`h-8 w-0.5 rounded my-2 ${
              completed ? "bg-primary" : "bg-[#767676]"
            }`}
          ></div>
        )}
      </div>
      <div className="mt-[1rem]">
        <h2
          className={`text-lg font-medium ${
            active || completed ? "text-primary" : "text-[#767676]"
          }`}
        >
          {title}
        </h2>
      </div>
    </div>
  );
};

function CreateProfile() {
  const tabs = [
    {
      Icon: IoPersonSharp,
      title: "Personal",
      completed: true,
      active: false,
    },
    {
      Icon: IoMdBriefcase,
      title: "Profession",
      completed: false,
      active: false,
    },
    {
      Icon: FaGraduationCap,
      title: "Education",
      completed: false,
      active: false,
    },
    {
      Icon: IoMdBriefcase,
      title: "Experience",
      completed: false,
      active: false,
    },
    {
      Icon: IoPersonSharp,
      title: "Profile",
      completed: false,
      active: false,
    },
  ];

  const methods = useForm({
    defaultValues: {
      dateOfBirth: undefined,
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      phoneNumber: "",
      country: "",
      state: "",
      city: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data); // Handle form submission
  };

  const countryData = Country.getAllCountries();
  const [stateData, setStateData] = useState<IState[]>();
  const [cityData, setCityData] = useState<ICity[]>();
  const [selectCountry, setSelectCountry] = useState<string>();
  const [selectedState, setSelectedState] = useState<string>();
  const [, setCountryValue] = useState("");
  const [, setStateValue] = useState("");

  useEffect(() => {
    setStateData(State.getStatesOfCountry(selectCountry));
    setCityData([]);
  }, [selectCountry]);

  useEffect(() => {
    if (selectCountry && selectedState) {
      setCityData(City.getCitiesOfState(selectCountry, selectedState));
    }
  }, [selectCountry, selectedState]);

  useEffect(() => {
    if (selectCountry && selectedState) {
      setCityData(City.getCitiesOfState(selectCountry, selectedState));
    }
  }, [selectCountry, selectedState]);

  return (
    <div className="px-4 py-8 md:px-8 lg:px-16 xl:px-24 2xl:px-32">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Job Site</h1>
      <h2 className="mt-2 text-lg md:text-xl font-semibold text-gray-700">
        Create Profile
      </h2>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        <div className="lg:col-span-3">
          <div className="flex lg:flex-col  overflow-x-auto pb-4 lg:pb-0 border-0 border-r-4 border-primary hide-scrollbar">
            {tabs.map((tab, index) => (
              <SingleTab
                key={index}
                Icon={tab.Icon}
                title={tab.title}
                active={tab.active}
                completed={tab.completed}
                isLast={index === tabs.length - 1}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-9 bg-white rounded-lg px-2 md:pl-6 md:pr-20  ">
          <div className="h-64 ">
            <FormProvider {...methods}>
              <form className="" onSubmit={methods.handleSubmit(onSubmit)}>
                <div>
                  <h1 className="font-semibold my-4">Personal</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2  gap-4 md:gap-10">
                    <FormField
                      control={methods.control}
                      name="dateOfBirth"
                      rules={{
                        required: "Required",
                      }}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Popover.Root>
                              <Popover.Trigger asChild>
                                <button
                                  className="flex items-center justify-between w-full h-10 px-3 border border-gray-400 rounded-md bg-white text-gray-500 text-sm focus:outline-none"
                                  type="button"
                                >
                                  {field.value
                                    ? format(field.value, "PPP")
                                    : "Date of Birth"}
                                  <CalendarIcon className="w-4 h-4 text-gray-600" />
                                </button>
                              </Popover.Trigger>

                              <Popover.Portal>
                                <Popover.Content
                                  align="start"
                                  sideOffset={8}
                                  className="z-50 bg-white p-3 rounded-md shadow-md border"
                                >
                                  <DayPicker
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    captionLayout="dropdown"
                                    fromYear={1900}
                                    toYear={new Date().getFullYear()}
                                  />
                                </Popover.Content>
                              </Popover.Portal>
                            </Popover.Root>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={methods.control}
                      name="gender"
                      rules={{
                        required: "Required",
                      }}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Select.Root
                              onValueChange={(value) => {
                                field.onChange(value);
                              }}
                              value={field.value}
                            >
                              <Select.Trigger className="flex items-center justify-between w-full h-10 px-3 border border-gray-400 rounded-md bg-white text-gray-500 text-sm focus:outline-none">
                                <Select.Value placeholder="Gender" />
                                <Select.Icon>
                                  <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                                </Select.Icon>
                              </Select.Trigger>

                              <Select.Portal>
                                <Select.Content className="z-50 mt-1 w-[--radix-select-trigger-width] rounded-md border border-gray-200 bg-white shadow-md">
                                  <Select.Viewport className="p-1">
                                    {["Male", "Female"].map((g) => (
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

                    <FormField
                      control={methods.control}
                      name="phoneNumber"
                      rules={{
                        required: "Required",
                        minLength: 6,
                      }}
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormLabel>Phone Number</FormLabel> */}
                          <FormControl>
                            <PhoneNumberInput
                              value={field.value}
                              onChange={field.onChange}
                              defaultCountry={countries.find(
                                (c) => c.code === "US"
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <h1 className="font-semibold my-4">Address</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
                    <FormField
                      control={methods.control}
                      name="country"
                      rules={{
                        required: "Required",
                      }}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          {/* <FormLabel>Country</FormLabel> */}
                          <FormControl>
                            <Select.Root
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectCountry(value);

                                const selectedCountry = countryData?.find(
                                  (country) => country.isoCode === value
                                );
                                if (selectedCountry) {
                                  setCountryValue(selectedCountry.name);
                                }
                              }}
                              value={field.value}
                            >
                              <Select.Trigger className="flex items-center justify-between w-full h-10 px-3 border border-gray-400 rounded-md bg-white text-gray-500 text-sm focus:outline-none">
                                <Select.Value placeholder="Select your country" />
                                <Select.Icon>
                                  <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                                </Select.Icon>
                              </Select.Trigger>

                              <Select.Portal>
                                <Select.Content className="z-50 mt-1 w-[--radix-select-trigger-width] rounded-md border border-gray-200 bg-white shadow-md">
                                  <Select.Viewport className="p-1">
                                    {countryData.map((country, index) => (
                                      <Select.Item
                                        key={country.isoCode + index}
                                        value={country.isoCode}
                                        className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded"
                                      >
                                        <Select.ItemText>
                                          {country.name}
                                        </Select.ItemText>
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

                    <FormField
                      control={methods.control}
                      name="state"
                      rules={{
                        required: "Required",
                      }}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          {/* <FormLabel>State</FormLabel> */}
                          <FormControl>
                            <Select.Root
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedState(value);
                                const selectedState = stateData?.find(
                                  (state) => state.isoCode === value
                                );
                                if (selectedState) {
                                  setStateValue(selectedState.name);
                                }
                              }}
                              value={field.value}
                            >
                              <Select.Trigger className="flex items-center justify-between w-full h-10 px-3 border border-gray-400 rounded-md bg-white text-gray-500 text-sm focus:outline-none">
                                <Select.Value placeholder="Select your state" />
                                <Select.Icon>
                                  <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                                </Select.Icon>
                              </Select.Trigger>

                              <Select.Portal>
                                <Select.Content className="z-50 mt-1 w-[--radix-select-trigger-width] rounded-md border border-gray-200 bg-white shadow-md">
                                  <Select.Viewport className="p-1">
                                    {stateData?.map((state, index) => (
                                      <Select.Item
                                        key={state.isoCode + index}
                                        value={state.isoCode}
                                        className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded"
                                      >
                                        <Select.ItemText>
                                          {state.name}
                                        </Select.ItemText>
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

                    <FormField
                      control={methods.control}
                      name="city"
                      rules={{
                        required: "Required",
                      }}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          {/* <FormLabel>City</FormLabel> */}
                          <FormControl>
                            <Select.Root
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <Select.Trigger className="flex items-center justify-between w-full h-10 px-3 border border-gray-400 rounded-md bg-white text-gray-500 text-sm focus:outline-none">
                                <Select.Value placeholder="Select your city" />
                                <Select.Icon>
                                  <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                                </Select.Icon>
                              </Select.Trigger>

                              <Select.Portal>
                                <Select.Content className="z-50 mt-1 w-[--radix-select-trigger-width] rounded-md border border-gray-200 bg-white shadow-md">
                                  <Select.Viewport className="p-1">
                                    {cityData?.map((city, index) => (
                                      <Select.Item
                                        key={city.stateCode + index}
                                        value={city.name}
                                        className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded"
                                      >
                                        <Select.ItemText>
                                          {city.name}
                                        </Select.ItemText>
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
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <Button className="px-10" type="submit">
                    Next
                  </Button>
                </div>

                {/* <div className="flex lg:flex-col sm-phone:flex-col gap-4r w-full">
                  <FormField
                    control={methods.control}
                    name="password"
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="confirmPassword"
                    rules={{
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === methods.watch("password") ||
                        "Passwords do not match",
                    }}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password again"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div> */}
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProfile;

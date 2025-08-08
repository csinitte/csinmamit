"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import MaxWidthWrapper from "~/components/layout/max-width-wrapper";
import EventsList from "~/components/events/EventsList";
import localFont from "next/font/local";
const myFont = localFont({ src: "../../pages/obscura.otf" });

const Events = () => {

  return (
    <MaxWidthWrapper className="mb-12 mt-6 sm:mt-9 lg:mt-12 flex flex-col items-center justify-center text-center px-4 sm:px-6">
        <>
          <div className="mt-6 sm:mt-10 mb-6 sm:mb-10">
          <h1
            className={`${myFont.className} bg-gradient-to-b from-pink-600 to-violet-400 bg-clip-text pt-6 sm:pt-10 text-center text-3xl sm:text-4xl lg:text-6xl font-black text-transparent underline-offset-2 `}
          >
            Events
          </h1>
            <p className="mt-3 sm:mt-5 max-w-prose text-zinc-700 text-sm sm:text-base lg:text-lg font-semibold px-4">
              We have successfully reached out many events. As we reflect back,
              here are some of the events organized by CSI!
            </p>
          </div>
          <Tabs defaultValue="2023" className="w-full max-w-6xl">
              <TabsList
                className="flex w-full overflow-x-auto no-scrollbar sm:justify-center gap-2 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-2"
              >
                {[
                  { year: "2019", label: "2019-20" },
                  { year: "2020", label: "2020-21" },
                  { year: "2021", label: "2021-22" },
                  { year: "2022", label: "2022-23" },
                  { year: "2023", label: "2023-24" },
                ].map(({ year, label }) => (
                  <TabsTrigger
                    key={year}
                    value={year}
                    className="flex-shrink-0 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:border-zinc-300 dark:data-[state=active]:border-zinc-600"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

            <TabsContent value="2019">
              <EventsList date="2019" />
            </TabsContent>
            <TabsContent value="2020">
              <EventsList date="2020" />
            </TabsContent>
            <TabsContent value="2021">
              <EventsList date="2021" />
            </TabsContent>
            <TabsContent value="2022">
              <EventsList date="2022" />
            </TabsContent>
            <TabsContent value="2023">
              <EventsList date="2023" />
            </TabsContent>
          </Tabs>
        </>
    
    </MaxWidthWrapper>
  );
};

export default Events;

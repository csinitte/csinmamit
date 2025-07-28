"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import MaxWidthWrapper from "~/components/layout/max-width-wrapper";
import Temp from "~/components/events/Temp";
import localFont from "next/font/local";
const myFont = localFont({ src: "../../pages/obscura.otf" });

const Events = () => {

  return (
    <MaxWidthWrapper className="mb-12 mt-9 sm:mt-12 flex flex-col items-center justify-center text-center">
        <>
          <div className="mt-10 mb-10">
          <h1
            className={`${myFont.className} bg-gradient-to-b from-pink-600 to-violet-400 bg-clip-text pt-10 text-center text-6xl font-black text-transparent underline-offset-2 `}
          >
            Events
          </h1>
            <p className="mt-5 max-w-prose text-zinc-700 sm-text-l font-semibold ">
              We have successfully reached out many events. As we reflect back,
              here are some of the events organized by CSI!
            </p>
          </div>
          <Tabs defaultValue="2023">
            <TabsList>
              <TabsTrigger value="2019">2019-2020</TabsTrigger>
              <TabsTrigger value="2020">2020-2021</TabsTrigger>
              <TabsTrigger value="2021">2021-2022</TabsTrigger>
              <TabsTrigger value="2022">2022-2023</TabsTrigger>
              <TabsTrigger value="2023">2023-2024</TabsTrigger>
            </TabsList>
            <TabsContent value="2019">
              <Temp date="2019" />
            </TabsContent>
            <TabsContent value="2020">
              <Temp date="2020" />
            </TabsContent>
            <TabsContent value="2021">
              <Temp date="2021" />
            </TabsContent>
            <TabsContent value="2022">
              <Temp date="2022" />
            </TabsContent>
            <TabsContent value="2023">
            <Temp date="2023" />
            </TabsContent>
          </Tabs>
        </>
    
    </MaxWidthWrapper>
  );
};

export default Events;


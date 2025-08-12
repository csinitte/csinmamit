// /**
//  * This is the client-side entry point for your tRPC API. It is used to create the `api` object which
//  * contains the Next.js App-wrapper, as well as your type-safe React Query hooks.
//  *
//  * We also create a few inference helpers for input and output types.
//  */
// import { createTRPCNext } from "@trpc/next";



// import { httpLink, loggerLink } from "@trpc/client";
// import { type AppRouter } from "~/server/api/root";
// import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
// import superjson from "superjson";
// import { getAuth } from "firebase/auth";

// const getBaseUrl = () => {
//   if (typeof window !== "undefined") return ""; // browser should use relative url
//   if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
//   return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
// };

// /** A set of type-safe react-query hooks for your tRPC API. */
// export const api = createTRPCNext<AppRouter>({
//   transformer: superjson,
//   config() {
//     return {
//       /**
//        * Links used to determine request flow from client to server.
//        *
//        * @see https://trpc.io/docs/links
//        */
//       links: [
//         loggerLink({
//           enabled: (opts) => {
//             return process.env.NODE_ENV === "development" ||
//             (opts.direction === "down" && opts.result instanceof Error);
//           },
//         }),
//         httpLink({
//           url: `${getBaseUrl()}/api/trpc`,
//           transformer: superjson,
//           async headers() {
//             const auth = getAuth();
//             if (auth.currentUser) {
//               try {
//                 const token = await auth.currentUser.getIdToken();
//                 return {
//                   Authorization: `Bearer ${token}`,
//                 };
//               } catch (error) {
//                 console.error('Error getting auth token:', error);
//                 return {};
//               }
//             }
//             return {};
//           },
//         }),
//       ],

//       /**
//        * Whether tRPC should await queries when server rendering pages.
//        *
//        * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
//        */
//       ssr: false,
//     };
//   },
//   /**
//    * Whether tRPC should await queries when server rendering pages.
//    *
//    * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
//    */
//   ssr: false,
// });

// /**
//  * Inference helper for inputs.
//  *
//  * @example type HelloInput = RouterInputs['example']['hello']
//  */
// export type RouterInputs = inferRouterInputs<AppRouter>;

// /**
//  * Inference helper for outputs.
//  *
//  * @example type HelloOutput = RouterOutputs['example']['hello']
//  */
// export type RouterOutputs = inferRouterOutputs<AppRouter>;

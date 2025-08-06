// import { createNextApiHandler } from "@trpc/server/adapters/next";

// import { env } from "~/env";
// import { appRouter } from "~/server/api/root";
// import { createTRPCContext } from "~/server/api/trpc";

// // export API handler
// export default createNextApiHandler({
//   router: appRouter,
//   createContext: createTRPCContext,
//   onError:
//     env.NODE_ENV === "development"
//       ? ({ path, error, ctx, input, type, req }) => {
//           console.error(
//             `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
//           );
//           console.error('Error details:', {
//             path,
//             error: error.message,
//             stack: error.stack,
//             ctx,
//             input,
//             type,
//             method: req.method,
//             url: req.url,
//           });
//         }
//       : undefined,
// });

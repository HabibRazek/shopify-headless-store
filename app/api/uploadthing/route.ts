import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/lib/uploadthing";

// Check if UploadThing is properly configured
const uploadThingToken = process.env.UPLOADTHING_TOKEN;

if (!uploadThingToken) {
  console.warn('⚠️ UPLOADTHING_TOKEN not found in environment variables');
}

// Create handlers with proper error handling
const handlers = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: uploadThingToken,
  },
});

export const GET = handlers.GET;
export const POST = handlers.POST;

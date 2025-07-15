import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Simplified FileRouter for production stability
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // Simplified middleware for production
      // Just return a basic metadata object
      return { uploadedAt: new Date().toISOString() };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ UploadThing upload complete:", file.url);
      console.log("Upload metadata:", metadata);

      return {
        url: file.url,
        uploadedAt: metadata.uploadedAt
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

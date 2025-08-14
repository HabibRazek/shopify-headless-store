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

  designUploader: f({
    "application/pdf": { maxFileSize: "8MB", maxFileCount: 1 },
    "application/postscript": { maxFileSize: "8MB", maxFileCount: 1 }, // .ai files
  })
    .middleware(async () => {
      // Middleware for design file uploads
      return {
        uploadedAt: new Date().toISOString(),
        type: 'design'
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ Design file upload complete:", file.url);
      console.log("Design upload metadata:", metadata);

      return {
        url: file.url,
        uploadedAt: metadata.uploadedAt,
        type: metadata.type
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// Export client-side components
import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

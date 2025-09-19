import { useState } from "react";
//useFileUpload with help from ChatGPT
export function useFileUpload(folder = "temp") {
  const [tempImagePath, setTempImagePath] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileUpload(file) {
    setIsUploading(true);
    try {
      // 1. Presigned URL vom Backend holen
      const res = await fetch("/api/images/getPresignedUploadUrl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          folder,
        }),
      });

      if (!res.ok) throw new Error("Failed to get presigned URL");

      const { url, key } = await res.json();

      // 2. Datei direkt zu S3 hochladen
      const uploadRes = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadRes.ok) throw new Error("Upload to S3 failed");

      // 3. Key speichern
      setTempImagePath(key);
      return key;
    } catch (error) {
      console.error(error);
      alert("Image upload failed.");
      return null;
    } finally {
      setIsUploading(false);
    }
  }

  return { tempImagePath, isUploading, handleFileUpload };
}

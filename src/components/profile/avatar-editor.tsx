
"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, Trash2, Loader2, Upload } from "lucide-react";
import { AppUser } from "@/lib/definitions";
import { updateAvatar, deleteAvatar } from "@/lib/profile-actions";
import { useRouter } from "next/navigation";

export function AvatarEditor({ user }: { user: AppUser }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    
    try {
      const base64String = await fileToBase64(selectedFile);
      const { error } = await updateAvatar({
        file: base64String,
        fileType: selectedFile.type,
        fileName: selectedFile.name,
      });

      if (error) {
        toast({ variant: "destructive", title: "Failed to upload avatar", description: error });
      } else {
        toast({ title: "Avatar updated successfully" });
        setSelectedFile(null);
        setPreviewUrl(null);
        router.refresh();
      }
    } catch (e: any) {
        toast({ variant: "destructive", title: "Failed to process file", description: e.message });
    } finally {
        setIsUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    setIsUploading(true);
    const { error } = await deleteAvatar();
    setIsUploading(false);
    
    if (error) {
       toast({ variant: "destructive", title: "Failed to remove avatar", description: error });
    } else {
      toast({ title: "Avatar removed" });
      setPreviewUrl(null);
      setSelectedFile(null);
      router.refresh();
    }
  };
  
  const displayUrl = previewUrl || user.avatarUrl;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
      <div className="relative">
        <Avatar className="h-24 w-24 border-2 border-primary/20">
          <AvatarImage key={displayUrl} src={displayUrl} alt={user.name} />
          <AvatarFallback className="text-3xl">
            {user.name ? user.name.charAt(0).toUpperCase() : ''}
          </AvatarFallback>
        </Avatar>
        {(isUploading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
      </div>
      <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
        {!selectedFile && (
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              size="sm"
              className="flex-1"
            >
              <Camera className="mr-2 h-4 w-4" />
              Change photo
            </Button>
        )}

        {selectedFile && (
           <Button onClick={handleUpload} disabled={isUploading} size="sm" className="flex-1">
             <Upload className="mr-2 h-4 w-4" />
             Update Avatar
           </Button>
        )}
        
        <Button
          variant="outline"
          onClick={handleDeleteAvatar}
          disabled={isUploading || (!user.avatarUrl && !previewUrl)}
          size="sm"
          className="flex-1"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg"
      />
    </div>
  );
}

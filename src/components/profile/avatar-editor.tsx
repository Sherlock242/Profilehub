
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

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("avatar", selectedFile);
    
    const { error } = await updateAvatar(formData);
    
    setIsUploading(false);

    if (error) {
      toast({ variant: "destructive", title: "Failed to upload avatar", description: error });
    } else {
      toast({ title: "Avatar updated successfully" });
      setSelectedFile(null);
      setPreviewUrl(null);
      router.refresh();
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
    <div className="flex items-center gap-6">
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
      <div className="flex flex-col gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg"
        />
        {!selectedFile && (
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              size="sm"
            >
              <Camera className="mr-2 h-4 w-4" />
              Change photo
            </Button>
        )}

        {selectedFile && (
           <Button onClick={handleUpload} disabled={isUploading} size="sm">
             <Upload className="mr-2 h-4 w-4" />
             Update Avatar
           </Button>
        )}
        
        <Button
          variant="outline"
          onClick={handleDeleteAvatar}
          disabled={isUploading || (!user.avatarUrl && !previewUrl)}
          size="sm"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}

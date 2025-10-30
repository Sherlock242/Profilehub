
"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Camera, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

export function AvatarEditor() {
  const { user, updateProfile, getSignedAvatarUrl } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      setIsUploading(true);
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError || !uploadData) {
        toast({ variant: "destructive", title: "Failed to upload avatar", description: uploadError?.message || "An unknown error occurred." });
        setIsUploading(false);
        return;
      }

      // We have the path, now update the profile with this path
      const success = await updateProfile({ avatar_url: uploadData.path });
      
      if (success) {
        toast({ title: "Avatar updated successfully" });
      } else {
        toast({ variant: "destructive", title: "Failed to update profile with new avatar." });
      }
      setIsUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user) return;
    setIsUploading(true);
    // Setting avatar_url to null or empty string in DB
    const success = await updateProfile({ avatar_url: '' }); 
    if (success) {
      toast({ title: "Avatar removed" });
    } else {
      toast({ variant: "destructive", title: "Failed to remove avatar" });
    }
    setIsUploading(false);
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <Avatar className="h-24 w-24 border-2 border-primary/20">
          <AvatarImage key={user.avatarUrl} src={user.avatarUrl} alt={user.name} />
          <AvatarFallback className="text-3xl">
            {user.name ? user.name.charAt(0).toUpperCase() : ''}
          </AvatarFallback>
        </Avatar>
        {isUploading && (
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
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          size="sm"
        >
          <Camera className="mr-2 h-4 w-4" />
          Change photo
        </Button>
        <Button
          variant="outline"
          onClick={handleDeleteAvatar}
          disabled={isUploading || !user.avatarUrl}
          size="sm"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}

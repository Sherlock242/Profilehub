"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Camera, Trash2, Loader2 } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function AvatarEditor() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const defaultAvatar = PlaceHolderImages.find(img => img.id === 'default-avatar')?.imageUrl;

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload delay
      await new Promise(res => setTimeout(res, 1000));
      const reader = new FileReader();
      reader.onloadend = async () => {
        const success = await updateProfile({ avatarUrl: reader.result as string });
        if (success) {
          toast({ title: "Avatar updated successfully" });
        } else {
          toast({ variant: "destructive", title: "Failed to update avatar" });
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = async () => {
    const success = await updateProfile({ avatarUrl: defaultAvatar });
    if (success) {
      toast({ title: "Avatar removed" });
    } else {
      toast({ variant: "destructive", title: "Failed to remove avatar" });
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <Avatar className="h-24 w-24 border-2 border-primary/20">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback className="text-3xl">
            {user.name.charAt(0).toUpperCase()}
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
        >
          <Camera className="mr-2 h-4 w-4" />
          Change photo
        </Button>
        <Button
          variant="outline"
          onClick={handleDeleteAvatar}
          disabled={isUploading || user.avatarUrl === defaultAvatar}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}

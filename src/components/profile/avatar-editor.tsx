
"use client";

import { ChangeEvent, useRef, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Camera, Trash2, Loader2, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

export function AvatarEditor() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
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
    if (!selectedFile || !user) return;

    setIsUploading(true);
    const filePath = `${user.id}/${Date.now()}_${selectedFile.name}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, selectedFile, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError || !uploadData) {
      toast({ variant: "destructive", title: "Failed to upload avatar", description: uploadError?.message || "An unknown error occurred." });
      setIsUploading(false);
      return;
    }
    
    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(uploadData.path);
    
    if (!publicUrlData.publicUrl) {
        toast({ variant: "destructive", title: "Failed to get public URL for avatar." });
        setIsUploading(false);
        return;
    }
    
    const success = await updateProfile({ avatar_url: publicUrlData.publicUrl + `?t=${new Date().getTime()}` });
    
    if (success) {
      toast({ title: "Avatar updated successfully" });
      setSelectedFile(null);
      setPreviewUrl(null);
    } else {
      toast({ variant: "destructive", title: "Failed to update profile with new avatar." });
    }
    setIsUploading(false);
  };

  const handleDeleteAvatar = async () => {
    if (!user) return;
    setIsUploading(true);
    const success = await updateProfile({ avatar_url: null }); 
    if (success) {
      toast({ title: "Avatar removed" });
      setPreviewUrl(null);
      setSelectedFile(null);
    } else {
      toast({ variant: "destructive", title: "Failed to remove avatar" });
    }
    setIsUploading(false);
  };
  
  useEffect(() => {
    // Clean up the object URL to avoid memory leaks
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!user) return null;

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
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          size="sm"
        >
          <Camera className="mr-2 h-4 w-4" />
          Change photo
        </Button>

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

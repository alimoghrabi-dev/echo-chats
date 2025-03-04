import React, { useEffect, useRef, useState } from "react";
import Image from "./Image";

interface ProfilePictureChangerProps {
  field: {
    value: File | string | undefined;
    onChange: (value: File | string) => void;
  };
  firstName: string;
  lastName: string;
}

const ProfilePictureChanger: React.FC<ProfilePictureChangerProps> = ({
  field,
  firstName,
  lastName,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);

  const placeholder = firstName.charAt(0) + lastName.charAt(0);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const imageFile = event.target.files[0];

      const imageUrl = URL.createObjectURL(imageFile);
      setPreview(imageUrl);

      field.onChange(imageFile);
    }
  };

  useEffect(() => {
    if (typeof field.value === "string") {
      setPreview(field.value);
    }
  }, [field.value]);

  return (
    <div className="mb-7 relative group rounded-full size-[90px] overflow-hidden cursor-pointer">
      {preview ? (
        <Image
          key={preview}
          src={preview}
          alt={`${firstName}'s profile`}
          className="w-full h-full object-cover rounded-full"
          loadingClassName="w-full h-full rounded-full border border-neutral-300 bg-neutral-200/50"
          loaderColor="text-neutral-800/80 size-6"
        />
      ) : (
        <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-primary/70 to-primary text-neutral-50 uppercase font-bold text-2xl">
          <span>{placeholder}</span>
        </div>
      )}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
      >
        <label className="text-white text-sm text-center font-medium cursor-pointer hover:underline">
          Update Image
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </button>
    </div>
  );
};

export default ProfilePictureChanger;

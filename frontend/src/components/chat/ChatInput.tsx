import React from "react";
import { Loader2, Send, X } from "lucide-react";
import { LuImagePlus } from "react-icons/lu";
import { sanitizeInput } from "@/lib/utils";

const ChatInput: React.FC<{
  message: string | null;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  sendMessage: (message: string) => void;
  isSendingMessage: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}> = ({
  message,
  setMessage,
  file,
  setFile,
  sendMessage,
  isSendingMessage,
  fileInputRef,
}) => {
  return (
    <div className="sticky bottom-0 inset-x-0 w-full flex flex-col gap-y-1 bg-primary/15 rounded-md px-4 hover:bg-primary/20 transition-all">
      {file && (
        <div className="relative size-11">
          <img
            src={URL.createObjectURL(file)}
            alt="image"
            className="w-full h-full rounded-lg object-cover object-center mt-2"
            loading="lazy"
          />
          <button
            onClick={() => {
              setFile(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            className="absolute top-1 -right-1.5 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-all size-5 flex items-center justify-center"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <div className="w-full h-12 flex items-center gap-x-2">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-neutral-700 hover:opacity-80 transition-all"
        >
          <LuImagePlus size={24} />
        </button>
        <input
          type="text"
          value={sanitizeInput(message || "")}
          onChange={(e) => setMessage(sanitizeInput(e.target.value))}
          onKeyDown={(e) => {
            if (isSendingMessage || (!message && !file)) return;

            if (e.key === "Enter") {
              sendMessage(message || "");
            }
          }}
          autoComplete="off"
          placeholder="Your message"
          className="w-full h-full outline-none bg-transparent text-neutral-800 placeholder:text-neutral-700 font-normal"
        />
        <button
          type="button"
          disabled={(!message && !file) || isSendingMessage}
          onClick={() => {
            if (message || file) {
              sendMessage(message || "");
            }
          }}
          className="text-neutral-700 hover:opacity-80 transition-all disabled:opacity-40"
        >
          {isSendingMessage ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={23} />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

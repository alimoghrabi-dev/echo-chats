import React, { Fragment, useState } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const Image: React.FC<{
  src: string;
  alt: string;
  className: string;
  loadingClassName: string;
  loaderColor: string;
  contain?: boolean;
}> = ({
  src,
  alt,
  className,
  loadingClassName,
  loaderColor,
  contain = false,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);

  return (
    <Fragment>
      <img
        src={src}
        alt={alt}
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
          width: "100%",
          height: "100%",
          objectFit: contain ? "contain" : "cover",
        }}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        className={className}
      />
      {!loaded && (
        <div
          className={cn(
            "absolute top-0 left-0 w-full h-full flex items-center justify-center",
            loadingClassName
          )}
        >
          <Loader2 size={32} className={cn("animate-spin", loaderColor)} />
        </div>
      )}
    </Fragment>
  );
};

export default Image;

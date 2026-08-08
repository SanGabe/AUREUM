"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";

function initials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length > 1) {
    return `${parts[0][0]}${parts.at(-1)?.[0]}`.toUpperCase();
  }

  return parts[0]?.slice(0, 2).toUpperCase() || "AU";
}

export function AccountAvatar({
  className,
  name,
}: {
  className?: string;
  name: string;
}) {
  const fallback = useMemo(
    () => initials(name),
    [name],
  );

  const [url, setUrl] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let active = true;

    async function load() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_path")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile?.avatar_path) {
        if (active) setUrl(null);
        return;
      }

      const { data } = await supabase.storage
        .from("profile-avatars")
        .createSignedUrl(
          profile.avatar_path,
          60 * 60,
        );

      if (active) {
        setUrl(data?.signedUrl ?? null);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  return (
    <span className={className}>
      {url ? (
        <img src={url} alt="" aria-hidden="true" />
      ) : (
        fallback
      )}
    </span>
  );
}

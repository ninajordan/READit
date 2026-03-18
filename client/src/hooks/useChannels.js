import { useEffect, useState } from "react";
import { fetchHomepageChannels } from "../features/channels/channelsApi.js";

export function useChannels() {
  const [channels, setChannels] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadChannels() {
      try {
        setStatus("loading");
        setError("");
        const data = await fetchHomepageChannels();
        if (!isActive) return;
        setChannels(Array.isArray(data.channels) ? data.channels : []);
        setStatus("success");
      } catch (err) {
        if (!isActive) return;
        setStatus("error");
        setError(err.message || "Failed to load channels");
      }
    }

    loadChannels();

    return () => {
      isActive = false;
    };
  }, []);

  return { channels, status, error };
}

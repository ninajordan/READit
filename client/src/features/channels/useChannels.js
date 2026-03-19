import { useCallback, useEffect, useState } from "react";
import {
  fetchChannels,
  fetchHomepageChannels,
  fetchChannelById,
  fetchChannelWithPosts,
  createChannel as createChannelApi,
  updateChannel as updateChannelApi,
  deleteChannel as deleteChannelApi,
} from "./channelsApi.js";

export function useChannels(initialFilters = {}) {
  const [channels, setChannels] = useState([]);
  const [filters, setFilters] = useState({
    search: initialFilters.search || "",
    category: initialFilters.category || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadChannels = useCallback(async (overrideFilters) => {
    try {
      setLoading(true);
      setError("");

      const activeFilters = overrideFilters ?? filters;
      const data = await fetchChannels(activeFilters);

      setChannels(Array.isArray(data?.channels) ? data.channels : Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load channels");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ search: "", category: "" });
  }, []);

  return {
    channels,
    filters,
    loading,
    error,
    loadChannels,
    updateFilters,
    resetFilters,
  };
}

export function useHomepageChannels() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadHomepageChannels = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchHomepageChannels();
      setChannels(Array.isArray(data?.channels) ? data.channels : Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load homepage channels");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHomepageChannels();
  }, [loadHomepageChannels]);

  return {
    channels,
    loading,
    error,
    loadHomepageChannels,
  };
}

export function useChannel(id) {
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadChannel = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const data = await fetchChannelById(id);
      setChannel(data?.channel ?? data);
    } catch (err) {
      setError(err.message || "Failed to load channel");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadChannel();
  }, [loadChannel]);

  return {
    channel,
    loading,
    error,
    loadChannel,
  };
}

export function useChannelWithPosts(id) {
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadChannelWithPosts = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const data = await fetchChannelWithPosts(id);
      setChannelData(data);
    } catch (err) {
      setError(err.message || "Failed to load channel posts");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadChannelWithPosts();
  }, [loadChannelWithPosts]);

  return {
    channelData,
    loading,
    error,
    loadChannelWithPosts,
  };
}

export function useChannelMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createChannel = useCallback(async (channelData) => {
    try {
      setLoading(true);
      setError("");

      return await createChannelApi(channelData);
    } catch (err) {
      setError(err.message || "Failed to create channel");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateChannel = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError("");

      return await updateChannelApi(id, updates);
    } catch (err) {
      setError(err.message || "Failed to update channel");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteChannel = useCallback(async (id) => {
    try {
      setLoading(true);
      setError("");

      return await deleteChannelApi(id);
    } catch (err) {
      setError(err.message || "Failed to delete channel");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createChannel,
    updateChannel,
    deleteChannel,
  };
}
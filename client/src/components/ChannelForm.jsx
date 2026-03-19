import { useState } from "react";

export default function ChannelForm({
  initialValues = {
    channelName: "",
    channelDescription: "",
    channelCategory: "",
    bannerImage: "",
    showOnHomepage: false,
  },
  onSubmit,
  submitLabel = "Create Channel",
}) {
  const [formData, setFormData] = useState(initialValues);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const payload = {
        channelName: formData.channelName,
        channelDescription: formData.channelDescription,
        channelCategory: formData.channelCategory,
        bannerImage: formData.bannerImage,
        showOnHomepage: formData.showOnHomepage,
      };

      await onSubmit(payload);
    } catch (err) {
      setError(err.message || "Failed to save channel");
    }
  }

  return (
    <form className="create-post" onSubmit={handleSubmit}>
      <label className="create-post__label" htmlFor="channel-name">
        Channel Name
      </label>
      <input
        id="channel-name"
        className="create-post__input"
        type="text"
        name="channelName"
        value={formData.channelName}
        onChange={handleChange}
        required
      />

      <label className="create-post__label" htmlFor="channel-description">
        Channel Description
      </label>
      <textarea
        id="channel-description"
        className="create-post__textarea"
        name="channelDescription"
        value={formData.channelDescription}
        onChange={handleChange}
        rows={4}
      />

      <label className="create-post__label" htmlFor="channel-banner">
        Banner Image
      </label>
      <input
        id="channel-banner"
        className="create-post__input"
        type="text"
        name="bannerImage"
        placeholder="Image URL"
        value={formData.bannerImage}
        onChange={handleChange}
      />

      <label className="create-post__label" htmlFor="channel-category">
        Channel Category
      </label>
      <input
        id="channel-category"
        className="create-post__input"
        type="text"
        name="channelCategory"
        maxLength={50}
        value={formData.channelCategory}
        onChange={handleChange}
      />

      <label className="create-post__checkbox">
        <input
          type="checkbox"
          name="showOnHomepage"
          checked={formData.showOnHomepage}
          onChange={handleChange}
        />
        Homepage channel?
      </label>

      <button className="create-post__button" type="submit">
        {submitLabel}
      </button>
      {error ? <p className="create-post__error">{error}</p> : null}
    </form>
  );
}

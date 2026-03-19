import { useState } from "react";

export default function ChannelForm({
  initialValues = {
    channelName: "",
    channelDescription: "",
    channelCategory: "",
    Homepage: false,
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
      const userID = sessionStorage.getItem("userID");
      const userAnonymity = sessionStorage.getItem("user_anonymity");

      const payload = {
        ...formData,
        createdBy: userID,
        createdByAnonymity: userAnonymity,
      };

      await onSubmit(payload);
    } catch (err) {
      setError(err.message || "Failed to save channel");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{submitLabel}</h2>

      {error ? <p>{error}</p> : null}

      <label>
        Channel Name
        <input
          type="text"
          name="channelName"
          value={formData.channelName}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Description
        <textarea
          name="channelDescription"
          value={formData.channelDescription}
          onChange={handleChange}
        />
      </label>

      <label>
        Category
        <input
          type="text"
          name="channelCategory"
          value={formData.channelCategory}
          onChange={handleChange}
        />
      </label>

      <label>
        Show on Homepage
        <input
          type="checkbox"
          name="Homepage"
          checked={formData.Homepage}
          onChange={handleChange}
        />
      </label>

      <button type="submit">{submitLabel}</button>
    </form>
  );
}
import { actions, isInputError } from "astro:actions";
import { useState } from "react";

export const ContactUsForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{
    name: Array<string>;
    email: Array<string>;
    message: Array<string>;
  }>({
    name: [],
    email: [],
    message: [],
  });

  const reset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setErrors({
      name: [],
      email: [],
      message: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await actions.contactUsAction({
      name,
      email,
      message,
    });

    if (error) {
      if (isInputError(error)) {
        setErrors({
          name: [...(error.fields.name ?? [])],
          email: [...(error.fields.email ?? [])],
          message: [...(error.fields.message ?? [])],
        });
      }
    } else {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="name">Navn</label>
        <input
          type="text"
          id="name"
          name="name"
          className="w-full rounded-xl border border-border shadow-md"
          placeholder="Kari Nordmann"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name.map((error) => (
          <p key={error} className="text-sm text-red-500">
            {error}
          </p>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email">E-post</label>
        <input
          required
          type="email"
          id="email"
          name="email"
          className="w-full rounded-xl border border-border shadow-md"
          placeholder="kari.nordmann@norge.no"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email.map((error) => (
          <p key={error} className="text-sm text-red-500">
            {error}
          </p>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="message">Melding</label>
        <textarea
          required
          rows={5}
          id="message"
          name="message"
          className="w-full rounded-xl border border-border shadow-md"
          placeholder="Din melding..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        {errors.message.map((error) => (
          <p key={error} className="text-sm text-red-500">
            {error}
          </p>
        ))}
      </div>

      <button
        className="w-full rounded-xl border border-border bg-primary-light px-4 py-2 shadow-md transition-all hover:bg-primary md:w-fit"
        type="submit"
      >
        Send inn
      </button>
    </form>
  );
};

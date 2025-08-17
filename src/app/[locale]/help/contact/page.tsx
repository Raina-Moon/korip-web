"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const ContactPage = () => {
  const { t } = useTranslation("help");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 여기에 실제 메일 전송 API 연결
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">{t("contact.successTitle")}</h1>
        <p className="text-gray-700">{t("contact.successBody")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">{t("contact.title")}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder={t("contact.form.namePlaceholder") as string}
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
          aria-label={t("contact.form.nameLabel")}
        />
        <input
          type="email"
          name="email"
          placeholder={t("contact.form.emailPlaceholder") as string}
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
          aria-label={t("contact.form.emailLabel")}
        />
        <textarea
          name="message"
          placeholder={t("contact.form.messagePlaceholder") as string}
          value={form.message}
          onChange={handleChange}
          rows={5}
          className="w-full border rounded-lg px-4 py-2"
          required
          aria-label={t("contact.form.messageLabel")}
        />
        <button
          type="submit"
          className="w-full bg-primary-700 text-white py-2 rounded-lg hover:bg-primary-800 transition"
        >
          {t("contact.form.submit")}
        </button>
      </form>
    </div>
  );
};

export default ContactPage;

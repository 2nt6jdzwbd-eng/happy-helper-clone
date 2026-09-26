import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/games" });
  },
  head: () => ({
    meta: [
      { title: "كريزي سكربت crazy script | سكربت الطياره وسكربت التفاحه" },
      {
        name: "description",
        content:
          "crazy script (كريزي سكربت): سكربت الطياره Aviator وسكربت التفاحه Apple of Fortune وإشارات ألعاب 1xBet وLineBet وWinWin وGreenBet وUltrapari مع كود تفعيل.",
      },
      { property: "og:title", content: "كريزي سكربت crazy script | سكربت الطياره وسكربت التفاحه" },
      { property: "og:description", content: "ابدأ الآن مع crazy script واحصل على كود التفعيل الخاص بك." },
      { name: "keywords", content: "سكربت الطياره, اسكربت الطياره, سكربت التفاحه, اسكربت التفاحه, كريزي سكربت, كريزي اسكربت, crazy script, crash script, apple of fortune script" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      {
        property: "og:image",
        content: "https://project--45915fe9-9986-4de9-aa3c-9c293e09ef07.lovable.app/logo.png",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:image",
        content: "https://project--45915fe9-9986-4de9-aa3c-9c293e09ef07.lovable.app/logo.png",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),

  component: () => null,
});

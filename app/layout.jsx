import "./globals.css";

export const metadata = {
  title: "Duarte Peixoto — Portfólio",
  description:
    "Designer & Developer em Braga. Uma galeria horizontal de projetos em identidade, web, direção de arte e movimento.",
  openGraph: {
    title: "Duarte Peixoto — Portfólio",
    description:
      "Designer & Developer em Braga. Uma galeria horizontal de projetos.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#f3efe6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&family=Pinyon+Script&family=Hanken+Grotesk:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

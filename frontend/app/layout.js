import "./globals.css";

export const metadata = {
  title: "Tienda de Empanadas",
  description: "Panel de administración",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ background: "#111111", margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
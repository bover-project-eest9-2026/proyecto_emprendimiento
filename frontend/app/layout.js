export const metadata = {
  title: "Mi app",
  description: "Proyecto",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
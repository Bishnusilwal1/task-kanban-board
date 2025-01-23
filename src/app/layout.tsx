import "./globals.css";
import TopBar from "./(components)/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex">
        <div className="flex flex-col flex-1">
          <TopBar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}

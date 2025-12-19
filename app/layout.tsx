import type { Metadata } from 'next';
import './globals.css';
import FloatingChatbot from '@/components/FloatingChatbot';

export const metadata: Metadata = {
  title: 'Health & Fitness - Your Path to Wellness',
  description: 'Discover personalized health, diet, and fitness solutions. Expert guidance on nutrition, workouts, and healthy living.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <FloatingChatbot />
      </body>
    </html>
  );
}


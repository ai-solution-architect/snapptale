import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className='flex flex-col items-center justify-center min-h-screen bg-snaptale-app-background p-4 sm:p-8'>
      <Image src="/Snaptale-Logo.png" alt="Snaptale Logo" width={200} height={50} className="w-48 md:w-64 h-auto mb-4" />
      <h1 className='text-4xl sm:text-5xl font-extrabold text-snaptale-highlight mb-6 font-poppins'>Snaptale</h1>
      <p className='mb-8 text-base sm:text-lg text-snaptale-shadow font-nunito'>
        Upload a photo to start your personalized storybook journey.
      </p>
      <Link href='/upload' className='bg-snaptale-highlight hover:bg-snaptale-shadow text-snaptale-shadow px-6 py-3 rounded focus:ring-2 focus:ring-snaptale-highlight font-poppins'>
        Go to Upload
      </Link>
    </main>
  );
}
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8'>
      <h1 className='text-5xl font-extrabold text-blue-600 mb-6'>Snapptale</h1>
      <p className='mb-8 text-lg'>
        Upload a photo to start your personalized storybook journey.
      </p>
      <Link href='/upload' className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded focus:ring-2 focus:ring-blue-500'>
        Go to Upload
      </Link>
    </main>
  );
}
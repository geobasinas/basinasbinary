import BinaryVisualizer from '@/app/components/BinaryVisualizer'

export const metadata = {
  title: 'Binary Representation Visualizer',
  description: 'Visualize binary representations of numbers, text, and images',
}

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Binary Visualizer</h1>
      <BinaryVisualizer />
    </main>
  )
}
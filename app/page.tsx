'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ImageIcon, Upload } from "lucide-react"
import Image from "next/image"

export default function Component() {
  const [image, setImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        setProcessedImage(null)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false
  })

  const removeBackground = async () => {
    if (!image) return
    
    setIsProcessing(true)
    try {
      // Simulating API call for background removal
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': 'YOUR_API_KEY_HERE'
        },
        body: JSON.stringify({ image: image })
      })

      if (!response.ok) {
        throw new Error('Background removal failed')
      }

      const result = await response.blob()
      const processedImageUrl = URL.createObjectURL(result)
      setProcessedImage(processedImageUrl)
    } catch (error) {
      console.error('Error removing background:', error)
      alert('Failed to remove background. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold">Background Remover</h1>
            <nav className="hidden md:flex space-x-4">
              <Button variant="ghost">Photo editor</Button>
              <Button variant="ghost">Business</Button>
              <Button variant="ghost">Resources</Button>
              <Button variant="ghost">Pricing</Button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">Log in</Button>
            <Button>Start creating</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Background Remover</h2>
          <p className="text-gray-600">
            Erase image backgrounds for free and replace it with different backgrounds of your choosing.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
                ${image ? 'border-none p-0' : ''}`}
            >
              <input {...getInputProps()} />
              {image ? (
                <div className="space-y-4">
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <Image
                      src={processedImage || image}
                      alt="Uploaded image"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button onClick={() => setImage(null)}>
                      Upload new image
                    </Button>
                    <Button
                      onClick={removeBackground}
                      disabled={isProcessing || !!processedImage}
                    >
                      {isProcessing ? 'Processing...' : 'Remove Background'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <Button variant="secondary" className="mx-auto">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Start from a photo
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">Or drop an image here</p>
                </div>
              )}
            </div>
          </Card>

          {!image && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-4">No image? Try one of these</p>
              <div className="flex justify-center gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <button key={n} className="w-16 h-16 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                    <Image
                      src={`/placeholder.svg?height=64&width=64`}
                      alt={`Example ${n}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
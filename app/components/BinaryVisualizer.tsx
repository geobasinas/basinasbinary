'use client'

import { useState, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Upload } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function BinaryVisualizer() {
  const [decimal, setDecimal] = useState('')
  const [binary, setBinary] = useState('')
  const [text, setText] = useState('')
  const [textBinary, setTextBinary] = useState<{ char: string; binary: string }[]>([])
  const [imageBinary, setImageBinary] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDecimalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDecimal(e.target.value)
    setError('')
  }

  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    setError('')
  }

  const convertDecimalToBinary = () => {
    const num = parseInt(decimal)
    if (isNaN(num) || num < 0 || num > 255) {
      setError('Please enter a valid number between 0 and 255.')
      setBinary('')
      return
    }
    setBinary(num.toString(2).padStart(8, '0'))
  }

  const convertTextToBinary = () => {
    if (text.length === 0) {
      setError('Please enter some text.')
      setTextBinary([])
      return
    }
    const binaryArray = text.split('').map(char => ({
      char,
      binary: char.charCodeAt(0).toString(2).padStart(8, '0')
    }))
    setTextBinary(binaryArray)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setError('No file selected.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const binaryString = event.target?.result as string
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const binary = Array.from(bytes)
        .map(byte => byte.toString(2).padStart(8, '0'))
        .join(' ')
      setImageBinary(binary.slice(0, 1000) + '...') // Truncate for display
    }
    reader.onerror = () => {
      setError('Error reading file.')
    }
    reader.readAsBinaryString(file)
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Binary Representation Visualizer</h1>
      
      <Tabs defaultValue="decimal" className="mb-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="decimal">Decimal to Binary</TabsTrigger>
          <TabsTrigger value="text">Text to Binary</TabsTrigger>
          <TabsTrigger value="image">Image to Binary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="decimal">
          <div className="flex space-x-2 mb-4">
            <Input
              type="number"
              placeholder="Enter a decimal number (0-255)"
              value={decimal}
              onChange={handleDecimalInputChange}
              min="0"
              max="255"
            />
            <Button onClick={convertDecimalToBinary}>Convert</Button>
          </div>
          
          {binary && (
            <div>
              <p className="mb-2 text-lg font-semibold">Binary representation: {binary}</p>
              <div className="flex space-x-1">
                {binary.split('').map((bit, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 flex items-center justify-center text-white font-bold rounded ${
                      bit === '1' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    {bit}
                  </div>
                ))}
              </div>
              <div className="flex space-x-1 mt-1">
                {binary.split('').map((_, index) => (
                  <div key={index} className="w-8 text-center text-xs">
                    2<sup>{7 - index}</sup>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="text">
          <div className="space-y-2 mb-4">
            <Textarea
              placeholder="Enter text to convert to binary"
              value={text}
              onChange={handleTextInputChange}
            />
            <Button onClick={convertTextToBinary} className="w-full">Convert</Button>
          </div>
          
          {textBinary.length > 0 && (
            <div>
              <p className="mb-2 text-lg font-semibold">Binary representation:</p>
              <div className="space-y-2">
                {textBinary.map(({ char, binary }, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-8 text-center font-semibold">{char}</div>
                    <div className="flex space-x-1">
                      {binary.split('').map((bit, bitIndex) => (
                        <div
                          key={bitIndex}
                          className={`w-6 h-6 flex items-center justify-center text-white text-xs font-bold rounded ${
                            bit === '1' ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        >
                          {bit}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm font-medium">Full binary string:</p>
              <p className="text-xs font-mono break-all">{textBinary.map(item => item.binary).join(' ')}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="image">
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                <Input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                />
              </label>
            </div>
            {imageBinary && (
              <div>
                <p className="mb-2 text-lg font-semibold">Binary representation (first 1000 bits):</p>
                <p className="text-xs font-mono break-all bg-gray-100 p-4 rounded-lg">{imageBinary}</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { parseUploadedFiles } from '@/services/fileService'
import { X, FileText, Image } from 'lucide-react'

interface FileUploadProps {
  onFilesUploaded: (textFiles: any[], imageFiles: any[]) => void
}

export default function FileUpload({ onFilesUploaded }: FileUploadProps) {
  const [uploadedTextFiles, setUploadedTextFiles] = useState<any[]>([])
  const [uploadedImageFiles, setUploadedImageFiles] = useState<any[]>([])
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const { textFiles, imageFiles } = await parseUploadedFiles(acceptedFiles)
      
      setUploadedTextFiles(prev => [...prev, ...textFiles])
      setUploadedImageFiles(prev => [...prev, ...imageFiles])
      
      onFilesUploaded(textFiles, imageFiles)
    } catch (error) {
      console.error('Error processing files:', error)
    }
  }, [onFilesUploaded])
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
  
  const removeTextFile = (index: number) => {
    const newFiles = [...uploadedTextFiles]
    newFiles.splice(index, 1)
    setUploadedTextFiles(newFiles)
    onFilesUploaded(newFiles, uploadedImageFiles)
  }
  
  const removeImageFile = (index: number) => {
    const newFiles = [...uploadedImageFiles]
    newFiles.splice(index, 1)
    setUploadedImageFiles(newFiles)
    onFilesUploaded(uploadedTextFiles, newFiles)
  }
  
  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-border'
        }`}
      >
        <input {...getInputProps()} />
        <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <p className="text-sm font-medium mb-1">
          {isDragActive ? 'Drop files here' : 'Drag and drop files here'}
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Upload images, diagrams, or text files to help describe your project
        </p>
        <Button variant="outline" size="sm" type="button">
          Browse Files
        </Button>
      </div>
      
      {(uploadedTextFiles.length > 0 || uploadedImageFiles.length > 0) && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Uploaded Files</h3>
          
          {uploadedTextFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs text-muted-foreground">Text Files</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {uploadedTextFiles.map((file, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-2 border rounded-md bg-background"
                  >
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm truncate">{file.name}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => removeTextFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {uploadedImageFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs text-muted-foreground">Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {uploadedImageFiles.map((file, index) => (
                  <div 
                    key={index} 
                    className="relative group border rounded-md overflow-hidden"
                  >
                    <img 
                      src={file.dataUrl} 
                      alt={file.name} 
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-white" 
                        onClick={() => removeImageFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                      <p className="text-xs text-white truncate">{file.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
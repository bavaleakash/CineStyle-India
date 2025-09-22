import { GoogleGenAI, Modality } from "@google/genai";
import React, { useState } from 'react';
import { Prompt } from '../types';
import Spinner from './Spinner';

declare var JSZip: any;

interface GenerationViewProps {
  prompt: Prompt;
  onBack: () => void;
}

interface UploadedFile {
  base64: string;
  mimeType: string;
  preview: string;
}

const GenerationView: React.FC<GenerationViewProps> = ({ prompt, onBack }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedForDownload, setSelectedForDownload] = useState<number[]>([]);
  const [showDownloadPreview, setShowDownloadPreview] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    const newFiles: UploadedFile[] = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    // Fix: Explicitly type `file` as `File` to resolve TypeScript errors.
    Array.from(files).slice(0, 3 - uploadedFiles.length).forEach((file: File) => {
      if (!allowedTypes.includes(file.type)) {
        setError(`File type ${file.type} is not supported. Please use JPEG, PNG, or WebP.`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        newFiles.push({
          base64: base64String,
          mimeType: file.type,
          preview: URL.createObjectURL(file),
        });
        if (newFiles.length === files.length) {
            setUploadedFiles(prev => [...prev, ...newFiles]);
        }
      };
      reader.onerror = () => {
        setError("Failed to read file.");
      }
      reader.readAsDataURL(file);
    });
  };
  
  const removeImage = (index: number) => {
    setUploadedFiles(files => files.filter((_, i) => i !== index));
  }

  const generateImages = async () => {
    if (uploadedFiles.length === 0) {
      setError('Please upload at least one image.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setSelectedForDownload([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const imageParts = uploadedFiles.map(file => ({
        inlineData: { data: file.base64, mimeType: file.mimeType },
      }));
      const textPart = { text: prompt.text };

      const generationPromises = Array(5).fill(0).map(() => 
        ai.models.generateContent({
          model: 'gemini-2.5-flash-image-preview',
          contents: { parts: [...imageParts, textPart] },
          config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
          },
        })
      );

      const responses = await Promise.all(generationPromises);

      const images: string[] = [];
      responses.forEach(response => {
        response.candidates?.[0]?.content?.parts?.forEach(part => {
          if (part.inlineData) {
            images.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
          }
        });
      });

      if(images.length === 0){
        setError("The model did not return any images. Please try a different style or reference photos.");
      }

      setGeneratedImages(images);
    } catch (e) {
      console.error(e);
      setError('An error occurred while generating images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = (base64Image: string, index: number) => {
    const link = document.createElement('a');
    link.href = base64Image;
    link.download = `generated-image-${prompt.id}-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDownloadPreview(null);
  };
  
  const toggleSelection = (index: number) => {
    setSelectedForDownload(prevSelected => {
      const currentIndex = prevSelected.indexOf(index);
      if (currentIndex > -1) {
        return prevSelected.filter(i => i !== index);
      } else {
        return [...prevSelected, index];
      }
    });
  };

  const downloadSelectedAsZip = async () => {
    if (selectedForDownload.length === 0) {
      setError("No images selected for download.");
      return;
    }
    if (typeof JSZip === 'undefined') {
        setError("Could not create ZIP file. JSZip library not found.");
        return;
    }

    setIsZipping(true);
    setError(null);

    try {
        const zip = new JSZip();
        
        selectedForDownload.forEach(index => {
            const imgData = generatedImages[index].split(',')[1];
            zip.file(`CineStyle-image-${prompt.id}-${index + 1}.png`, imgData, { base64: true });
        });

        const content = await zip.generateAsync({ type: "blob" });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `CineStyle-India-Collection.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        setSelectedForDownload([]);
    } catch (e) {
        console.error(e);
        setError("An error occurred while creating the ZIP file.");
    } finally {
        setIsZipping(false);
    }
  };


  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      <button onClick={onBack} className="mb-6 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
        &larr; Back to Styles
      </button>
      <h2 className="text-2xl font-bold mb-6">
        Selected Style: <span className="font-semibold text-indigo-600">{prompt.title}</span>
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Upload Images (up to 3)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            {uploadedFiles.map((file, index) => (
                <div key={index} className="relative group">
                    <img src={file.preview} alt={`upload preview ${index}`} className="w-full h-32 object-cover rounded-md" loading="lazy" decoding="async"/>
                    <button onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                </div>
            ))}
            {uploadedFiles.length < 3 && (
                <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <span className="text-gray-500 text-2xl">+</span>
                    <span className="text-sm text-gray-500">Add Image</span>
                    <input
                        type="file"
                        multiple
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isLoading}
                    />
                </label>
            )}
        </div>
      </div>
      
      <button
        onClick={generateImages}
        disabled={isLoading || uploadedFiles.length === 0}
        className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        {isLoading && <Spinner />}
        {isLoading ? 'Generating...' : 'Generate 5 Images'}
      </button>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      
      {generatedImages.length > 0 && !isLoading && (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Your Generated Images</h3>
              {selectedForDownload.length > 0 && (
                <button
                  onClick={downloadSelectedAsZip}
                  disabled={isZipping}
                  className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center"
                >
                  {isZipping && <Spinner />}
                  {isZipping ? 'Zipping...' : `Download ${selectedForDownload.length} as ZIP`}
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {generatedImages.map((img, index) => (
                    <div key={index} className="group relative">
                        <img src={img} alt={`generated image ${index + 1}`} className="w-full h-auto rounded-lg shadow-md" loading="lazy" decoding="async"/>
                        <div 
                          className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold cursor-pointer"
                          onClick={() => setShowDownloadPreview(img)}
                        >
                            Preview & Download
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedForDownload.includes(index)}
                          onChange={() => toggleSelection(index)}
                          className="absolute top-2 left-2 h-6 w-6 rounded-md text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
                          aria-label={`Select image ${index + 1} for download`}
                        />
                    </div>
                ))}
            </div>
        </div>
      )}

      {showDownloadPreview && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDownloadPreview(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-title"
        >
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <h3 id="preview-title" className="text-xl font-bold mb-4">Image Preview</h3>
            <div className="flex justify-center bg-gray-100 rounded">
              <img src={showDownloadPreview} alt="Download preview" className="w-full h-auto max-h-[70vh] object-contain rounded-md mb-4"/>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setShowDownloadPreview(null)} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-400 transition-colors">
                Close
              </button>
              <button onClick={() => downloadImage(showDownloadPreview, generatedImages.indexOf(showDownloadPreview))} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                Confirm Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerationView;
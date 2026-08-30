import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Loader2, X } from 'lucide-react';
import { cloudinaryService } from '../../services/cloudinaryService';

interface ImageUploaderProps {
  currentValue: string;
  onChange: (value: string) => void;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentValue,
  onChange,
  label = "Cover Image Asset"
}) => {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [dragging, setDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file.');
      return;
    }
    setUploadError('');
    setIsUploading(true);
    try {
      const url = await cloudinaryService.uploadImage(file);
      onChange(url);
    } catch (err: any) {
      setUploadError(err?.message || 'Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="form-label mb-0">{label}</label>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold font-mono transition-all ${
              tab === 'upload' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Drag & Drop
          </button>
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold font-mono transition-all ${
              tab === 'url' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Image URL
          </button>
        </div>
      </div>

      {currentValue ? (
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-sm">
          <img src={currentValue} alt="Uploaded preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold flex items-center gap-1 shadow-md"
            >
              <X className="w-4 h-4" /> Replace Image
            </button>
          </div>
        </div>
      ) : tab === 'upload' ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`relative aspect-[16/8] w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
            dragging
              ? 'border-indigo-600 bg-indigo-50/50'
              : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-white'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            disabled={isUploading}
            onChange={e => e.target.files && e.target.files[0] && handleFileUpload(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
          />
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 mb-2 shadow-sm">
            {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          </div>
          <span className="text-sm font-bold text-slate-800">
            {isUploading ? 'Uploading to Cloudinary…' : 'Click to upload or drag image here'}
          </span>
          {!isUploading && (
            <span className="text-xs text-slate-500 font-mono mt-1">PNG, JPG, WEBP or SVG up to 10MB</span>
          )}
          {uploadError && (
            <span className="text-xs text-red-600 font-mono mt-2">{uploadError}</span>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="Paste absolute image URL (e.g. https://res.cloudinary.com/...)"
              className="form-input text-xs font-mono pl-9"
            />
          </div>
          <button
            type="button"
            onClick={() => { if (urlInput.trim()) onChange(urlInput.trim()); }}
            className="btn-primary text-xs shrink-0 py-2"
          >
            Apply URL
          </button>
        </div>
      )}
    </div>
  );
};

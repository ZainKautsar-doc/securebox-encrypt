import React, { useRef, useState } from 'react';
import { UploadCloud, File, X, AlertTriangle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  accept?: string;
  maxSizeMB?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  accept,
  maxSizeMB = 10,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds protocol limit of ${maxSizeMB} MB (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
      onFileSelect(null);
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept={accept}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`bg-graphite-lift rounded-sm p-8 text-center cursor-pointer transition-colors duration-150 ${
            isDragging
              ? 'border-2 border-solid border-electric-indigo bg-graphite-lift/90'
              : 'border-2 border-dashed border-periwinkle-veil hover:border-solid hover:border-electric-indigo'
          }`}
        >
          <div className="mx-auto w-12 h-12 flex items-center justify-center text-electric-indigo mb-3">
            <UploadCloud className="w-8 h-8" />
          </div>
          <p className="text-sm font-sans text-soft-mist mb-1">
            Drag files here or click to browse
          </p>
          <p className="text-xs font-mono text-soft-mist/60">
            MAX PAYLOAD: {maxSizeMB} MB // PROTOCOL IN-MEMORY
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-carbon-panel border border-graphite-lift rounded-sm">
          <div className="flex items-center space-x-3 truncate">
            <div className="w-9 h-9 bg-electric-indigo text-pure-signal rounded-sm flex items-center justify-center flex-shrink-0">
              <File className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-sm font-sans font-medium text-pure-signal truncate">{selectedFile.name}</p>
              <p className="text-xs font-mono text-soft-mist/60">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onFileSelect(null);
              if (inputRef.current) inputRef.current.value = '';
            }}
            className="p-1.5 text-soft-mist/60 hover:text-orchid-whisper rounded-sm transition cursor-pointer"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-2.5 p-3 bg-orchid-whisper/10 border border-orchid-whisper text-orchid-whisper rounded-sm text-xs font-mono flex items-center space-x-2">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

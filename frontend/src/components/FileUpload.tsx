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
      setError(`File size exceeds limit of ${maxSizeMB} MB (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
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
          className={`bg-ash rounded-base p-10 text-center cursor-pointer transition-all duration-200 ease-out border ${
            isDragging
              ? 'border-solid border-phosphor scale-[1.01]'
              : 'border-dashed border-charcoal hover:border-solid hover:border-phosphor hover:scale-[1.01]'
          }`}
        >
          <div className="mx-auto w-12 h-12 flex items-center justify-center text-phosphor mb-3">
            <UploadCloud className="w-8 h-8 stroke-[1.5]" />
          </div>
          <p className="text-sm font-normal text-silver mb-1">
            Drag files here or click to browse
          </p>
          <p className="text-xs font-mono text-smoke">
            MAX PAYLOAD: {maxSizeMB} MB // MEMORY-HARD EXECUTION
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-ash border border-charcoal rounded-base transition-all duration-150 hover:border-graphite">
          <div className="flex items-center space-x-3.5 truncate">
            <div className="w-10 h-10 bg-charcoal text-phosphor rounded-sm flex items-center justify-center flex-shrink-0">
              <File className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-snow truncate">{selectedFile.name}</p>
              <p className="text-xs font-mono text-smoke">
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
            className="p-1.5 text-smoke hover:text-snow rounded-full hover:bg-charcoal transition cursor-pointer"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3.5 bg-smoke/[0.08] border border-smoke/30 text-smoke rounded-sm text-xs font-mono flex items-center space-x-2 animate-fade-in-down">
          <AlertTriangle className="w-4 h-4 text-smoke flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

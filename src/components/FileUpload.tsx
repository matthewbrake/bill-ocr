import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  onUseCamera: () => void;
  isConfigured: boolean;
  onConfigure: () => void;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

const CameraIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const CogIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-1.57 1.996A1.532 1.532 0 013 7.482c-1.56.38-1.56 2.6 0 2.98a1.532 1.532 0 01.948 2.286c-.836 1.372.734 2.942 1.996 1.57a1.532 1.532 0 012.286.948c.38 1.56 2.6 1.56 2.98 0a1.532 1.532 0 012.286-.948c1.372.836 2.942-.734 1.57-1.996A1.532 1.532 0 0117 12.518c1.56-.38 1.56-2.6 0-2.98a1.532 1.532 0 01-.948-2.286c.836-1.372-.734-2.942-1.996-1.57A1.532 1.532 0 0111.49 3.17zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);


export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, onUseCamera, isConfigured, onConfigure }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isConfigured) setIsDragging(true);
  }, [isConfigured]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isConfigured && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  }, [onFileUpload, isConfigured]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isConfigured && e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  const disabledClasses = !isConfigured ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <div className="space-y-4">
        {!isConfigured && (
             <div className="p-4 bg-sky-50 dark:bg-sky-900/20 border-l-4 border-sky-400 dark:border-sky-500/50 rounded-r-lg flex items-center justify-between">
                <div>
                    <h3 className="text-md font-semibold text-sky-800 dark:text-sky-300">Configuration Required</h3>
                    <p className="text-sm text-sky-700 dark:text-sky-400 mt-1">
                       Please set up your AI provider before you can analyze a bill.
                    </p>
                </div>
                <button onClick={onConfigure} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors">
                    <CogIcon className="w-5 h-5" />
                    Configure
                </button>
            </div>
        )}
        <div 
            className={`relative flex flex-col items-center justify-center w-full p-8 transition-all duration-300 border-2 border-dashed rounded-xl
            ${isDragging ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}
            ${!isDragging && isConfigured ? 'hover:border-slate-400 dark:hover:border-slate-500' : ''}
            ${disabledClasses}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <input 
                type="file" 
                id="file-upload" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
                disabled={!isConfigured}
            />
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <UploadIcon />
                <p className="text-slate-600 dark:text-slate-300">
                    <span className={`font-semibold ${isConfigured ? 'text-sky-600 dark:text-sky-400' : ''}`}>Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG, or WEBP</p>
            </div>
        </div>
        <div className="flex items-center space-x-2">
            <hr className="flex-grow border-slate-200 dark:border-slate-700"/>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">OR</span>
            <hr className="flex-grow border-slate-200 dark:border-slate-700"/>
        </div>
         <button 
            onClick={onUseCamera}
            disabled={!isConfigured}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-slate-600 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-900 transition-colors
            ${isConfigured ? 'hover:bg-slate-700 dark:hover:bg-slate-600' : 'opacity-50 cursor-not-allowed'}`}
        >
            <CameraIcon className="w-5 h-5"/>
            Use Camera
        </button>
    </div>
  );
};

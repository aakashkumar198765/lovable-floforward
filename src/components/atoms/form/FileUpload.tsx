import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { FileUploadProps, CommerceState } from '../../../types';
import { cn } from '../../../utils/utils';
import { Upload, File, X } from 'lucide-react';
import { Label } from '../display';
import Button from './Button';

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      id = '',
      name = '',
      disabled = false,
      readonly = false,
      required = false,
      multiple = false,
      accept = '',
      maxSize = 10 * 1024 * 1024, // 10MB default
      minSize = 0, // Minimum file size in bytes
      maxFiles = 5,
      allowedTypes = [],
      showPreview = true,
      dragAndDrop = true,
      variant = 'default',
      size = 'md',
      status = 'default',
      label = '',
      helperText = '',
      errorMessage = '',
      uploadText = 'Choose files or drag and drop',
      uploadingText = 'Uploading...',
      successText = 'Upload successful',
      className = '',
      style = {},
      files = [],
      onFilesChange = () => {},
      onFileRemove = () => {},
      onUploadStart = () => {},
      onUploadProgress = () => {},
      onUploadComplete = () => {},
      onUploadError = () => {},
      customUpload,
      ...props
    },
    ref
  ) => {
    const [internalFiles, setInternalFiles] = useState<File[]>(files || []);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
    const [uploadStatus, setUploadStatus] = useState<Record<string, 'pending' | 'uploading' | 'success' | 'error'>>({});
    const [errors, setErrors] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);


    // Update internal files when external files change
    useEffect(() => {
      if (files && Array.isArray(files) && files?.length > 0) {
        setInternalFiles(files);
      }
    }, [files]);

    // File validation
    const validateFile = (file: File): string | null => {
      // Check minimum file size
      if (minSize && file.size < minSize) {
        return `File size must be at least ${formatFileSize(minSize)}`;
      }

      // Check maximum file size
      if (maxSize && file.size > maxSize) {
        return `File size exceeds ${formatFileSize(maxSize)}`;
      }

      // Check file type
      if (allowedTypes.length > 0) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const mimeType = file.type;
        
        const isValidType = allowedTypes.some(type => {
          if (type.startsWith('.')) {
            return fileExtension === type.slice(1);
          }
          return mimeType.includes(type);
        });

        if (!isValidType) {
          return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
        }
      }

      // Check accept attribute
      if (accept && !isFileAccepted(file, accept)) {
        return `File type not accepted: ${file.type}`;
      }

      return null;
    };

    // Check if file matches accept attribute
    const isFileAccepted = (file: File, acceptString: string): boolean => {
      if (!acceptString) return true;
      
      const acceptTypes = acceptString.split(',').map(type => type.trim());
      return acceptTypes.some(type => {
        if (type === '*/*') return true;
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type === type;
      });
    };

    // Format file size
    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Handle file selection
    const handleFiles = (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);
      const validFiles: File[] = [];
      const fileErrors: string[] = [];

      // Validate each file
      fileArray.forEach(file => {
        const error = validateFile(file);
        if (error) {
          fileErrors.push(`${file.name}: ${error}`);
        } else {
          validFiles.push(file);
        }
      });

      // Check total file count
      const totalFiles = internalFiles.length + validFiles.length;
      if (maxFiles && totalFiles > maxFiles) {
        fileErrors.push(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Update files and errors
      if (multiple) {
        const updatedFiles = [...internalFiles, ...validFiles];
        setInternalFiles(updatedFiles);
        setErrors(fileErrors);
        
        if (onFilesChange && typeof onFilesChange === 'function') {
          onFilesChange(updatedFiles, validFiles);
        }
      } else {
        if (validFiles.length > 0) {
          const newFile = validFiles[0];
          setInternalFiles([newFile]);
          setErrors(fileErrors);
          
          if (onFilesChange && typeof onFilesChange === 'function') {
            onFilesChange([newFile], [newFile]);
          }
        }
      }
    };

    // Handle file input change
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
    };

    // Handle drag and drop
    const handleDragOver = (event: React.DragEvent) => {
      event.preventDefault();
      if (!disabled && !readonly && dragAndDrop) {
        setIsDragOver(true);
      }
    };

    const handleDragLeave = (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);
    };

    const handleDrop = (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);
      
      if (disabled || readonly || !dragAndDrop) return;
      
      const droppedFiles = event.dataTransfer.files;
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles);
      }
    };

    // Handle file removal
    const handleFileRemove = (index: number) => {
      const fileToRemove = internalFiles[index];
      const updatedFiles = internalFiles.filter((_, i) => i !== index);
      setInternalFiles(updatedFiles);
      
      // Clean up upload status
      const fileName = fileToRemove.name;
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileName];
        return newProgress;
      });
      setUploadStatus(prev => {
        const newStatus = { ...prev };
        delete newStatus[fileName];
        return newStatus;
      });
      
      if (onFileRemove && typeof onFileRemove === 'function') {
        onFileRemove(fileToRemove, index);
      }
      
      if (onFilesChange && typeof onFilesChange === 'function') {
        onFilesChange(updatedFiles, []);
      }
    };

    // Handle click to browse
    const handleBrowseClick = () => {
      if (!disabled && !readonly && fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    // Size classes
    const sizeClasses = {
      sm: 'p-4 text-sm',
      md: 'p-6 text-base',
      lg: 'p-8 text-lg'
    };

    // Variant classes
    const variantClasses = {
      default: 'border-2 border-dashed border-gray-300 bg-white',
      outlined: 'border-2 border-solid border-gray-300 bg-transparent',
      filled: 'border-0 bg-gray-100'
    };

    // Status classes
    const statusClasses = {
      default: 'border-gray-300 hover:border-primary-400',
      error: 'border-error-500',
      warning: 'border-warning-500',
      success: 'border-success-500'
    };


    // Upload area classes
    const uploadAreaClasses = cn(
      'w-full rounded-lg transition-all duration-200 cursor-pointer',
      'font-work-sans text-center',
      'focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-opacity-50',
      'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
      sizeClasses[size] || sizeClasses.md,
      variantClasses[variant] || variantClasses.default,
      status && status !== 'default' && statusClasses[status] ? statusClasses[status] : statusClasses.default,
      isDragOver && 'border-primary-500 bg-primary-50',
      disabled && 'cursor-not-allowed opacity-50',
      className || ''
    );

    // Label classes
    const labelClasses = cn(
      'block text-sm font-medium text-gray-700 mb-2',
      required && 'after:content-["*"] after:text-error-500 after:ml-1'
    );

    // Helper text classes
    const helperTextClasses = cn(
      'mt-1 text-sm text-gray-500',
      status === 'error' && 'text-error-500',
      status === 'warning' && 'text-warning-500',
      status === 'success' && 'text-success-500'
    );

    // Upload icon
    const UploadIcon = () => (
      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
    );

    // File icon
    const FileIcon = () => (
      <File className="w-5 h-5" />
    );

    // Remove icon
    const RemoveIcon = () => (
      <X className="w-4 h-4" />
    );

    return (
      <div className="space-y-2" style={style}>
        {label && label !== '' && (
          <Label className={labelClasses}>
            {label}
          </Label>
        )}
        
        <div
          className={uploadAreaClasses}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <input
            ref={fileInputRef}
            id={id || ''}
            name={name || ''}
            type="file"
            multiple={multiple}
            accept={accept}
            disabled={disabled}
            readOnly={readonly}
            required={required}
            className="hidden"
            onChange={handleInputChange}
            aria-describedby={
              (helperText && helperText !== '') || (errorMessage && errorMessage !== '') || errors.length > 0
                ? `${id || 'fileupload'}-description`
                : undefined
            }
            {...props}
          />
          
          <div className="flex flex-col items-center justify-center">
            <UploadIcon />
            <p className="text-gray-600 font-medium">
              {uploadText}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {accept && `Accepted: ${accept}`}
              {minSize && minSize > 0 && ` • Min size: ${formatFileSize(minSize)}`}
              {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
              {maxFiles && ` • Max files: ${maxFiles}`}
            </p>
          </div>
        </div>
        
        {/* File list */}
        {internalFiles.length > 0 && showPreview && (
          <div className="space-y-2">
            {internalFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <FileIcon />
                <div className="flex-1 ml-3">
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  {uploadProgress[file.name] !== undefined && (
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-primary-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress[file.name]}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {!disabled && !readonly && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileRemove(index);
                    }}
                    className="ml-3 p-1 text-gray-400 hover:text-error-500 transition-colors duration-200"
                    aria-label={`Remove ${file.name}`}
                  >
                    <RemoveIcon />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Error and Helper Messages */}
        {(errors.length > 0 || (errorMessage && errorMessage !== '') || (helperText && helperText !== '')) && (
          <div id={`${id || 'fileupload'}-description`} className="space-y-1">
            {errors.length > 0 && (
              <div className="text-sm text-error-500">
                {errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
            {status === 'error' && errorMessage && errorMessage !== '' && (
              <p className={helperTextClasses}>{errorMessage}</p>
            )}
            {status !== 'error' && helperText && helperText !== '' && (
              <p className={helperTextClasses}>{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;
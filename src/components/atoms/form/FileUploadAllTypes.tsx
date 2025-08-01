import React, { useState } from 'react';
import FileUpload from './FileUpload';

const FileUploadAllTypes: React.FC = () => {
  const [basicFiles, setBasicFiles] = useState<File[]>([]);
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);
  const [dragDropFiles, setDragDropFiles] = useState<File[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [restrictedFiles, setRestrictedFiles] = useState<File[]>([]);
  const [errorFiles, setErrorFiles] = useState<File[]>([]);
  const [readonlyFiles, setReadonlyFiles] = useState<File[]>([]);

  const handleBasicFilesChange = (files: File[], newFiles: File[]) => {
    setBasicFiles(files);
    console.log('Basic files changed:', files);
  };

  const handleMultipleFilesChange = (files: File[], newFiles: File[]) => {
    setMultipleFiles(files);
    console.log('Multiple files changed:', files);
  };

  const handleDragDropFilesChange = (files: File[], newFiles: File[]) => {
    setDragDropFiles(files);
    console.log('Drag drop files changed:', files);
  };

  const handleImageFilesChange = (files: File[], newFiles: File[]) => {
    setImageFiles(files);
    console.log('Image files changed:', files);
  };

  const handleDocumentFilesChange = (files: File[], newFiles: File[]) => {
    setDocumentFiles(files);
    console.log('Document files changed:', files);
  };

  const handleRestrictedFilesChange = (files: File[], newFiles: File[]) => {
    setRestrictedFiles(files);
    console.log('Restricted files changed:', files);
  };

  const handleErrorFilesChange = (files: File[], newFiles: File[]) => {
    setErrorFiles(files);
    console.log('Error files changed:', files);
  };

  const handleReadonlyFilesChange = (files: File[], newFiles: File[]) => {
    setReadonlyFiles(files);
    console.log('Readonly files changed:', files);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic File Upload</h3>
        <FileUpload
          id="basic-upload"
          name="basicUpload"
          label="Basic File Upload"
          helperText="Upload any file up to 10MB"
          accept="image/*,.pdf,.doc,.docx"
          files={basicFiles}
          onFilesChange={handleBasicFilesChange}
        />
        {basicFiles.length > 0 && (
          <div className="mt-2 p-2 bg-green-50 rounded-md">
            <p className="text-sm text-green-800">
              Uploaded files: {basicFiles.map(f => f.name).join(', ')}
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Multiple File Upload</h3>
        <FileUpload
          id="multiple-upload"
          name="multipleUpload"
          label="Multiple File Upload"
          helperText="Upload multiple files (max 5 files)"
          accept="image/*,.pdf,.doc,.docx"
          multiple={true}
          maxFiles={5}
          maxSize={5 * 1024 * 1024} // 5MB
          minSize={1024} // 1KB minimum
          uploadText="Drop files here or click to browse"
          files={multipleFiles}
          onFilesChange={handleMultipleFilesChange}
        />
        {multipleFiles.length > 0 && (
          <div className="mt-2 p-2 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              Multiple files: {multipleFiles.map(f => f.name).join(', ')}
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Drag & Drop Upload</h3>
        <FileUpload
          id="drag-drop-upload"
          name="dragDropUpload"
          label="Drag & Drop Upload"
          helperText="Drag and drop files or click to browse"
          variant="outlined"
          size="lg"
          dragAndDrop={true}
          showPreview={true}
          commerceState="initiation"
          multiple={true}
          maxFiles={3}
          maxSize={10 * 1024 * 1024} // 10MB
          minSize={512} // 512 bytes minimum
          files={dragDropFiles}
          onFilesChange={handleDragDropFilesChange}
        />
        {dragDropFiles.length > 0 && (
          <div className="mt-2 p-2 bg-purple-50 rounded-md">
            <p className="text-sm text-purple-800">
              Drag & drop files: {dragDropFiles.map(f => f.name).join(', ')}
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Image Upload Only</h3>
        <FileUpload
          id="image-upload"
          name="imageUpload"
          label="Image Upload"
          helperText="Upload images only (JPG, PNG, GIF, WebP)"
          accept="image/*"
          multiple={true}
          maxFiles={10}
          maxSize={2 * 1024 * 1024} // 2MB
          uploadText="Drop images here or click to browse"
          variant="filled"
          files={imageFiles}
          onFilesChange={handleImageFilesChange}
        />
        {imageFiles.length > 0 && (
          <div className="mt-2 p-2 bg-indigo-50 rounded-md">
            <p className="text-sm text-indigo-800">
              Image files: {imageFiles.map(f => f.name).join(', ')}
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Document Upload</h3>
        <FileUpload
          id="document-upload"
          name="documentUpload"
          label="Document Upload"
          helperText="Upload documents (PDF, DOC, DOCX, TXT)"
          accept=".pdf,.doc,.docx,.txt"
          multiple={true}
          maxFiles={5}
          maxSize={20 * 1024 * 1024} // 20MB
          uploadText="Drop documents here or click to browse"
          files={documentFiles}
          onFilesChange={handleDocumentFilesChange}
        />
        {documentFiles.length > 0 && (
          <div className="mt-2 p-2 bg-yellow-50 rounded-md">
            <p className="text-sm text-yellow-800">
              Document files: {documentFiles.map(f => f.name).join(', ')}
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Restricted File Upload</h3>
        <FileUpload
          id="restricted-upload"
          name="restrictedUpload"
          label="Restricted File Upload"
          helperText="Strict file size and type restrictions"
          allowedTypes={['.jpg', '.png', '.pdf']}
          maxFiles={2}
          maxSize={1 * 1024 * 1024} // 1MB
          minSize={10 * 1024} // 10KB minimum
          uploadText="Only JPG, PNG, PDF files (10KB - 1MB)"
          files={restrictedFiles}
          onFilesChange={handleRestrictedFilesChange}
        />
        {restrictedFiles.length > 0 && (
          <div className="mt-2 p-2 bg-orange-50 rounded-md">
            <p className="text-sm text-orange-800">
              Restricted files: {restrictedFiles.map(f => f.name).join(', ')}
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload with Error State</h3>
        <FileUpload
          id="error-upload"
          name="errorUpload"
          label="Upload with Error"
          status="error"
          errorMessage="File upload failed. Please try again."
          variant="filled"
          files={errorFiles}
          onFilesChange={handleErrorFilesChange}
        />
        {errorFiles.length > 0 && (
          <div className="mt-2 p-2 bg-red-50 rounded-md">
            <p className="text-sm text-red-800">
              Error files: {errorFiles.map(f => f.name).join(', ')}
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Read-only Upload (Settlement State)</h3>
        <FileUpload
          id="readonly-upload"
          name="readonlyUpload"
          label="Read-only Upload (Settlement State)"
          helperText="File upload is disabled in settlement state"
          commerceState="settlement"
          allowedActions={[]} // No edit permission
          files={readonlyFiles}
          onFilesChange={handleReadonlyFilesChange}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">File Upload Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FileUpload
            id="default-variant default-variant-file"
            name="defaultVariant"
            label="Default Variant"
            helperText="Default dashed border"
            variant="default"
            uploadText="Default style"
          />
          <FileUpload
            id="outlined-variant outlined-variant-file"
            name="outlinedVariant"
            label="Outlined Variant"
            helperText="Solid border outline"
            variant="outlined"
            uploadText="Outlined style"
          />
          <FileUpload
            id="filled-variant filled-variant-file"
            name="filledVariant"
            label="Filled Variant"
            helperText="Filled background"
            variant="filled"
            uploadText="Filled style"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">File Upload Sizes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FileUpload
            id="small-size"
            name="smallSize"
            label="Small Size"
            helperText="Compact upload area"
            size="sm"
            uploadText="Small upload"
          />
          <FileUpload
            id="medium-size"
            name="mediumSize"
            label="Medium Size"
            helperText="Standard upload area"
            size="md"
            uploadText="Medium upload"
          />
          <FileUpload
            id="large-size"
            name="largeSize"
            label="Large Size"
            helperText="Spacious upload area"
            size="lg"
            uploadText="Large upload"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">File Upload Status States</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUpload
            id="warning-status"
            name="warningStatus"
            label="Warning Status"
            helperText="This is a warning state"
            status="warning"
            uploadText="Warning state"
          />
          <FileUpload
            id="success-status"
            name="successStatus"
            label="Success Status"
            helperText="This is a success state"
            status="success"
            uploadText="Success state"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Commerce State Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUpload
            id="initiation-state"
            name="initiationState"
            label="Initiation State"
            helperText="Full upload capabilities"
            commerceState="initiation"
            uploadText="Initiation state"
          />
          <FileUpload
            id="agreement-state"
            name="agreementState"
            label="Agreement State"
            helperText="Partial restrictions may apply"
            commerceState="agreement"
            uploadText="Agreement state"
          />
          <FileUpload
            id="execution-state"
            name="executionState"
            label="Execution State"
            helperText="Active state with full features"
            commerceState="execution"
            uploadText="Execution state"
          />
          <FileUpload
            id="completion-state"
            name="completionState"
            label="Completion State"
            helperText="Read-only state"
            commerceState="completion"
            uploadText="Completion state"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Advanced Upload Features</h3>
        <div className="space-y-4">
          <FileUpload
            id="no-preview"
            name="noPreview"
            label="No Preview Upload"
            helperText="Files are uploaded without preview"
            showPreview={false}
            uploadText="No preview mode"
          />
          <FileUpload
            id="no-drag-drop"
            name="noDragDrop"
            label="No Drag & Drop"
            helperText="Click to browse only"
            dragAndDrop={false}
            uploadText="Click to browse (no drag & drop)"
          />
          <FileUpload
            id="custom-text"
            name="customText"
            label="Custom Text Upload"
            helperText="Custom upload messages"
            uploadText="🎯 Click here to select your awesome files!"
            uploadingText="⏳ Uploading your files..."
            successText="✅ Files uploaded successfully!"
          />
        </div>
      </div>
    </div>
  );
};

export default FileUploadAllTypes;
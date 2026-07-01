"use client"

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, FileCode, X, AlertTriangle } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

interface FileUploadZoneProps {
  onFilesChanged: (files: File[]) => void
  fileType: string
  onFileTypeChanged: (type: string) => void
}

const ALLOWED_EXTENSIONS = [
  '.py', '.js', '.ts', '.jsx', '.tsx', '.json', '.yaml', 
  '.yml', '.toml', '.html', '.css', '.sql', '.go', '.java', '.rb', '.zip'
]

export default function FileUploadZone({ onFilesChanged, fileType, onFileTypeChanged }: FileUploadZoneProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setErrorMsg(null)
    
    // Whitelist extension check
    const validFiles = acceptedFiles.filter(file => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase()
      return ALLOWED_EXTENSIONS.includes(ext)
    })

    if (validFiles.length < acceptedFiles.length) {
      setErrorMsg("Some files were skipped due to unsupported file extensions.")
    }

    const newFiles = [...selectedFiles]
    
    for (const file of validFiles) {
      if (!newFiles.some(f => f.name === file.name)) {
        newFiles.push(file)
      }
    }

    // Client-side validations
    if (newFiles.length > 20) {
      setErrorMsg("Exceeded maximum upload limit of 20 files.")
      return
    }

    const totalSize = newFiles.reduce((acc, f) => acc + f.size, 0)
    if (totalSize > 50 * 1024 * 1024) {
      setErrorMsg("Total size of uploaded files exceeds 50MB limit.")
      return
    }

    setSelectedFiles(newFiles)
    onFilesChanged(newFiles)
  }, [selectedFiles, onFilesChanged])

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles]
    newFiles.splice(index, 1)
    setSelectedFiles(newFiles)
    onFilesChanged(newFiles)
    setErrorMsg(null)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 20
  })

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6 select-none">
      {/* Drop area */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all min-h-[180px] flex flex-col justify-center items-center bg-surface/30",
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud size={36} className={cn("mb-3.5", isDragActive ? "text-primary" : "text-textMuted")} />
        
        <p className="text-sm font-semibold text-textPrimary mb-1">
          {isDragActive ? "Drop your files here..." : "Drag files here or click to browse"}
        </p>
        <p className="text-xs text-textSecondary">
          Supports .py .js .ts .jsx .tsx .zip and other config files
        </p>
      </div>

      {/* Error displays */}
      {errorMsg && (
        <div className="flex items-start space-x-2 text-danger bg-dangerBg/5 border border-danger/20 p-3 rounded-md text-xs">
          <AlertTriangle size={15} className="shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Selected file list */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-textSecondary">Selected Files ({selectedFiles.length})</h4>
          <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1.5 scrollbar-thin">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-card border border-border rounded-md text-xs">
                <div className="flex items-center space-x-2.5 truncate flex-1 min-w-0 mr-3">
                  <FileCode size={15} className="text-primary shrink-0" />
                  <span className="font-semibold text-textPrimary truncate">{file.name}</span>
                  <span className="text-[10px] text-textMuted shrink-0">({formatSize(file.size)})</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="text-textSecondary hover:text-danger hover:bg-dangerBg/10 p-1 rounded-sm transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File type selector radio pills */}
      <div className="border-t border-border pt-4">
        <label className="text-xs font-bold uppercase tracking-wider text-textSecondary block mb-2.5">
          Primary File Type / Focus
        </label>
        <div className="flex space-x-2 bg-surface p-1 rounded-md border border-border w-fit">
          {['Backend', 'Frontend', 'Mixed'].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => onFileTypeChanged(type)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-sm transition-all focus:outline-none",
                fileType === type
                  ? "bg-card text-textPrimary shadow-sm border border-border"
                  : "text-textSecondary hover:text-textPrimary"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

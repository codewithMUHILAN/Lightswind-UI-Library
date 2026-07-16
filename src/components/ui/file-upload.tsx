"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, File, CheckCircle2 } from "lucide-react";
import { cn } from "@/components/lib/utils";

export interface FileUploadProps {
  onUpload?: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
  className?: string;
}

export const FileUpload = ({
  onUpload,
  maxFiles = 3,
  accept = "*",
  className,
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles: File[]) => {
    const combined = [...files, ...newFiles].slice(0, maxFiles);
    setFiles(combined);
    if (onUpload) onUpload(combined);
  };

  const removeFile = (index: number) => {
    const filtered = files.filter((_, i) => i !== index);
    setFiles(filtered);
    if (onUpload) onUpload(filtered);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
          isDragging 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          multiple={maxFiles > 1}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-4 text-center px-6">
          <div className={cn(
            "p-4 rounded-full transition-transform duration-300",
            isDragging ? "bg-primary text-white scale-110" : "bg-muted text-muted-foreground"
          )}>
            <Upload className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-lg">Click or drop files here</p>
            <p className="text-sm text-muted-foreground">
              Maximum {maxFiles} files. Supports various formats.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="grid grid-cols-1 gap-2"
          >
            {files.map((file, i) => (
              <motion.div
                key={file.name + i}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-2xl border border-border/10"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <File className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                    <span className="text-[10px] text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <button 
                    onClick={() => removeFile(i)}
                    className="p-1 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

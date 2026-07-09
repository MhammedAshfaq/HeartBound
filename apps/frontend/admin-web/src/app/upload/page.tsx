'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  File,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  Download,
  Trash2,
  FolderOpen,
} from 'lucide-react';

type FileStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UploadedFile {
  id: string;
  file: File;
  preview: string | null;
  status: FileStatus;
  progress: number;
}

function getFileIcon(file: File) {
  const type = file.type;
  if (type.startsWith('image/')) return ImageIcon;
  if (type.startsWith('video/')) return Film;
  if (type.startsWith('audio/')) return Music;
  if (type.includes('pdf') || type.includes('text') || type.includes('document')) return FileText;
  return File;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileColor(file: File): string {
  const type = file.type;
  if (type.startsWith('image/')) return '#06b6d4';
  if (type.startsWith('video/')) return '#f59e0b';
  if (type.startsWith('audio/')) return '#10b981';
  if (type.includes('pdf')) return '#ef4444';
  if (type.includes('text') || type.includes('document')) return '#7c3aed';
  return '#94a3b8';
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((rawFiles: FileList | File[]) => {
    const arr = Array.from(rawFiles);
    const newEntries: UploadedFile[] = arr.map((file) => {
      const isImage = file.type.startsWith('image/');
      const preview = isImage ? URL.createObjectURL(file) : null;
      return {
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        preview,
        status: 'idle' as FileStatus,
        progress: 0,
      };
    });
    setFiles((prev) => [...prev, ...newEntries]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const f = prev.find((f) => f.id === id);
      if (f?.preview) URL.revokeObjectURL(f.preview);
      return prev.filter((f) => f.id !== id);
    });
    if (previewFile?.id === id) setPreviewFile(null);
  };

  const simulateUpload = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'uploading', progress: 0 } : f))
    );
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status: 'success', progress: 100 } : f))
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress } : f))
        );
      }
    }, 150);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#7c3aed',
              background: 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.25)',
              borderRadius: '999px',
              padding: '3px 10px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            File Manager
          </span>
        </div>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#f8fafc',
            letterSpacing: '-0.5px',
          }}
        >
          Upload Files
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
          Drag & drop or browse files — images get a live visual preview.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: previewFile ? '1fr 380px' : '1fr', gap: '24px', alignItems: 'start' }}>
        <div>
          {/* Drop Zone */}
          <div
            className={`drop-zone${dragging ? ' dragging' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            style={{
              padding: '56px 32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              marginBottom: '28px',
              transition: 'all 0.3s ease',
            }}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={handleInputChange}
              accept="*/*"
            />
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '20px',
                background: dragging
                  ? 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(6,182,212,0.2))'
                  : 'rgba(124,58,237,0.1)',
                border: `1px solid ${dragging ? 'rgba(124,58,237,0.6)' : 'rgba(124,58,237,0.25)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                transition: 'all 0.3s ease',
                boxShadow: dragging ? '0 0 40px rgba(124,58,237,0.3)' : 'none',
              }}
            >
              {dragging ? (
                <FolderOpen size={30} color="#a78bfa" />
              ) : (
                <Upload size={30} color="#7c3aed" />
              )}
            </div>
            <p
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#f8fafc',
                marginBottom: '6px',
              }}
            >
              {dragging ? 'Drop to upload' : 'Drop files here'}
            </p>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', textAlign: 'center' }}>
              Supports all file types — images, videos, PDFs, documents
            </p>
            <div
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                borderRadius: '10px',
                padding: '10px 24px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#fff',
                boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
              }}
            >
              Browse Files
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <h2
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#f8fafc',
                  }}
                >
                  Files ({files.length})
                </h2>
                <button
                  onClick={() => {
                    files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
                    setFiles([]);
                    setPreviewFile(null);
                  }}
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#ef4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <Trash2 size={12} />
                  Clear All
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {files.map((entry) => {
                  const Icon = getFileIcon(entry.file);
                  const color = getFileColor(entry.file);
                  const isActive = previewFile?.id === entry.id;

                  return (
                    <div
                      key={entry.id}
                      style={{
                        background: isActive
                          ? 'rgba(124,58,237,0.08)'
                          : 'rgba(255,255,255,0.03)',
                        border: isActive
                          ? '1px solid rgba(124,58,237,0.35)'
                          : '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '14px',
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        transition: 'all 0.2s ease',
                        animation: 'fadeInUp 0.3s ease forwards',
                      }}
                    >
                      {/* Thumbnail or Icon */}
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          background: `${color}18`,
                          border: `1px solid ${color}30`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {entry.preview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={entry.preview}
                            alt={entry.file.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <Icon size={20} color={color} />
                        )}
                      </div>

                      {/* File Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#f8fafc',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginBottom: '3px',
                          }}
                        >
                          {entry.file.name}
                        </p>
                        <p style={{ fontSize: '11px', color: '#64748b' }}>
                          {formatSize(entry.file.size)} •{' '}
                          {entry.file.type || 'Unknown type'}
                        </p>
                        {/* Progress bar */}
                        {entry.status === 'uploading' && (
                          <div
                            style={{
                              marginTop: '8px',
                              height: '3px',
                              background: 'rgba(255,255,255,0.08)',
                              borderRadius: '999px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${entry.progress}%`,
                                background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                                borderRadius: '999px',
                                transition: 'width 0.15s ease',
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Status + Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        {entry.status === 'uploading' && (
                          <Loader2 size={16} color="#7c3aed" style={{ animation: 'spin 1s linear infinite' }} />
                        )}
                        {entry.status === 'success' && (
                          <CheckCircle2 size={16} color="#10b981" />
                        )}
                        {entry.status === 'error' && (
                          <AlertCircle size={16} color="#ef4444" />
                        )}
                        {entry.status === 'idle' && (
                          <button
                            onClick={() => simulateUpload(entry.id)}
                            style={{
                              background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '5px 12px',
                              fontSize: '12px',
                              fontWeight: 600,
                              color: '#fff',
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
                            }}
                          >
                            Upload
                          </button>
                        )}
                        {entry.preview && (
                          <button
                            onClick={() => setPreviewFile(isActive ? null : entry)}
                            title="Preview"
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '8px',
                              background: isActive ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.06)',
                              border: isActive ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              flexShrink: 0,
                            }}
                          >
                            <Eye size={13} color={isActive ? '#a78bfa' : '#94a3b8'} />
                          </button>
                        )}
                        <button
                          onClick={() => removeFile(entry.id)}
                          title="Remove"
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '8px',
                            background: 'rgba(239,68,68,0.08)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            flexShrink: 0,
                          }}
                        >
                          <X size={13} color="#ef4444" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {files.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '24px',
                color: '#475569',
                fontSize: '13px',
              }}
            >
              No files selected yet
            </div>
          )}
        </div>

        {/* Preview Panel */}
        {previewFile && (
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(124,58,237,0.2)',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'sticky',
              top: '96px',
              animation: 'fadeInUp 0.3s ease forwards',
            }}
          >
            {/* Preview header */}
            <div
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(124,58,237,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={15} color="#7c3aed" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                  Preview
                </span>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={12} color="#94a3b8" />
              </button>
            </div>

            {/* Image preview */}
            {previewFile.preview && (
              <div
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '240px',
                  padding: '16px',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewFile.preview}
                  alt={previewFile.file.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '320px',
                    borderRadius: '10px',
                    objectFit: 'contain',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  }}
                />
              </div>
            )}

            {/* File metadata */}
            <div style={{ padding: '18px' }}>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#f8fafc',
                  marginBottom: '12px',
                  wordBreak: 'break-all',
                }}
              >
                {previewFile.file.name}
              </p>
              {[
                { label: 'Size', value: formatSize(previewFile.file.size) },
                { label: 'Type', value: previewFile.file.type || 'Unknown' },
                {
                  label: 'Modified',
                  value: new Date(previewFile.file.lastModified).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  }),
                },
                {
                  label: 'Status',
                  value:
                    previewFile.status === 'idle'
                      ? 'Ready to upload'
                      : previewFile.status === 'uploading'
                      ? `Uploading ${Math.round(previewFile.progress)}%`
                      : previewFile.status === 'success'
                      ? 'Uploaded ✓'
                      : 'Failed',
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', maxWidth: '180px', textAlign: 'right', wordBreak: 'break-all' }}>
                    {value}
                  </span>
                </div>
              ))}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                {previewFile.preview && (
                  <a
                    href={previewFile.preview}
                    download={previewFile.file.name}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '9px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#94a3b8',
                      textDecoration: 'none',
                    }}
                  >
                    <Download size={13} />
                    Save
                  </a>
                )}
                {previewFile.status === 'idle' && (
                  <button
                    onClick={() => simulateUpload(previewFile.id)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '9px',
                      background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#fff',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
                    }}
                  >
                    <Upload size={13} />
                    Upload
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

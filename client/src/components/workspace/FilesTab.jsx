import React, { useState } from 'react';
import {
  Upload,
  File,
  FileText,
  Image as ImageIcon,
  Code,
  Archive,
  Download,
  Trash2,
  Plus
} from 'lucide-react';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { workspaceService } from '../../services/workspaceService';

export const FilesTab = ({ project, files = [], onFileUpdate }) => {
  const { user } = useAuth();
  const toast = useToast();

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState('general');
  const [uploading, setUploading] = useState(false);

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-purple-400" />;
      case 'code':
        return <Code className="w-5 h-5 text-emerald-400" />;
      case 'archive':
        return <Archive className="w-5 h-5 text-amber-400" />;
      case 'pdf':
      case 'document':
      default:
        return <FileText className="w-5 h-5 text-indigo-400" />;
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file to upload.');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('category', category);

      await workspaceService.uploadFile(project._id, formData);
      toast.success('File uploaded successfully!');
      setUploadModalOpen(false);
      setSelectedFile(null);
      onFileUpdate();
    } catch (err) {
      toast.error('Failed to upload file.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Delete this file from project repository?')) return;
    try {
      await workspaceService.deleteFile(fileId);
      toast.info('File removed.');
      onFileUpdate();
    } catch (err) {
      toast.error('Failed to delete file.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <File className="w-5 h-5 text-indigo-400" />
            Project File Repository ({files.length})
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Centralized assets, design specifications, documentation, and source archives.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Upload}
          onClick={() => setUploadModalOpen(true)}
        >
          Upload Asset
        </Button>
      </div>

      {/* Files Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => (
          <div
            key={file._id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-start gap-3 mb-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                  {getFileIcon(file.fileType)}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-slate-100 truncate" title={file.name}>
                    {file.name}
                  </h4>
                  <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span className="capitalize">{file.category || 'General'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                <Avatar src={file.uploadedBy?.avatar} name={file.uploadedBy?.name} size="xs" />
                <span className="truncate">Uploaded by {file.uploadedBy?.name}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
              <span className="text-[10px] text-slate-500">
                {new Date(file.createdAt).toLocaleDateString()}
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 hover:text-white transition-colors"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>

                {file.uploadedBy?._id === user?._id && (
                  <button
                    onClick={() => handleDeleteFile(file._id)}
                    className="p-1.5 rounded-lg bg-rose-950/30 text-rose-400 hover:bg-rose-950/60 transition-colors"
                    title="Delete File"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {files.length === 0 && (
          <div className="col-span-full bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
            <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2 opacity-60" />
            <span>No files uploaded to this workspace yet.</span>
          </div>
        )}
      </div>

      {/* Upload File Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Project Asset"
        subtitle="Share documents, design prototypes, or source archives with your team."
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-8 text-center cursor-pointer bg-slate-950/60">
            <input
              type="file"
              id="file-upload-input"
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <label htmlFor="file-upload-input" className="cursor-pointer block">
              <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-200">
                {selectedFile ? selectedFile.name : 'Choose a file or drag it here'}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Supports images, PDF, code files, and zip archives (max 25MB)
              </div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="general">General Asset</option>
              <option value="design">Design & Figma Asset</option>
              <option value="document">Documentation / Spec</option>
              <option value="code">Source Code Archive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={uploading} disabled={!selectedFile}>
              Upload File
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

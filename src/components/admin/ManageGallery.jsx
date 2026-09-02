import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Plus, Trash2, Upload, Edit2, X } from 'lucide-react';
import { api } from '../../services/api';
import Button from '../ui/Button';
import ImageCropper from '../ui/ImageCropper';

export default function ManageGallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [cropperFile, setCropperFile] = useState(null);
  const [repositionUrl, setRepositionUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image_url: '',
    description: '',
    display_order: 0
  });

  const categories = ['Campus', 'Academic', 'Arts & Sports', 'Internship', 'Community'];

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const data = await api.getGallery();
      setGallery(data);
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to fetch gallery photos' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // ── New upload via cropper ───────────────────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';
    setCropperFile(file);
  };

  const handleCropperApply = async (croppedFile) => {
    setCropperFile(null);
    setRepositionUrl(null);
    setUploading(true);
    try {
      const res = await api.uploadFile(croppedFile);
      setFormData((prev) => ({ ...prev, image_url: res.url }));
      setFeedback({ type: 'success', message: isEditing ? 'Image repositioned & uploaded' : 'Photo uploaded successfully' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const handleCropperCancel = () => {
    setCropperFile(null);
    setRepositionUrl(null);
  };

  // ── Reposition existing image ───────────────────────────────────────
  const handleReposition = (url) => {
    setRepositionUrl(url);
  };

  // ── Edit mode ───────────────────────────────────────────────────────
  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      category: item.category || '',
      image_url: item.image_url || '',
      description: item.description || '',
      display_order: item.display_order || 0
    });
    setIsEditing(true);
    setCurrentId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setFormData({ title: '', category: '', image_url: '', description: '', display_order: 0 });
    setIsEditing(false);
    setCurrentId(null);
  };

  // ── Submit ──────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image_url) {
      setFeedback({ type: 'error', message: 'Please provide or upload an image' });
      return;
    }

    try {
      if (isEditing) {
        await api.updateGalleryItem(currentId, formData);
        setFeedback({ type: 'success', message: 'Photo updated successfully' });
      } else {
        await api.createGalleryItem(formData);
        setFeedback({ type: 'success', message: 'Photo added to archive successfully' });
      }
      handleResetForm();
      fetchGallery();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Save failed' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo from archive?')) return;
    try {
      await api.deleteGalleryItem(id);
      setFeedback({ type: 'success', message: 'Photo deleted' });
      fetchGallery();
    } catch (err) {
      setFeedback({ type: 'error', message: 'Delete failed' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-dark-border">
        <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-accent-light mb-1">
          Archive Management
        </div>
        <h1 className="text-2xl font-bold font-sans text-white">
          Photo Gallery & Media Archive
        </h1>
        <p className="text-xs text-ink-light-muted mt-1">
          Upload and curate images for the editorial photo archive on the public site.
        </p>
      </div>

      {feedback.message && (
        <div
          className={`p-3.5 rounded-md text-xs flex items-center justify-between gap-3 ${
            feedback.type === 'success'
              ? 'bg-accent/15 border border-accent/30 text-accent-light'
              : 'bg-rose-950/60 border border-rose-800 text-rose-300'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback({ type: '', message: '' })}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Form */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6 sm:p-8 space-y-6">
        <h2 className="text-base font-bold font-sans text-white flex items-center gap-2">
          {isEditing ? <Edit2 className="w-4 h-4 text-accent-light" /> : <Plus className="w-4 h-4 text-accent-light" />}
          <span>{isEditing ? 'Edit Photo' : 'Upload / Add New Photo'}</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-light-secondary mb-1.5">
                Photo Caption / Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Smart Classroom Micro-Teaching Session"
                className="w-full px-3.5 py-2.5 bg-dark border border-dark-border rounded-md text-xs text-white focus:outline-none focus:border-accent-light"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-light-secondary mb-1.5">
                Category (Optional)
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-dark border border-dark-border rounded-md text-xs text-white focus:outline-none focus:border-accent-light"
              >
                <option value="">Choose...</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-light-secondary mb-1.5">
              Image URL / Upload File *
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://... or select photo file"
                className="flex-1 px-3.5 py-2.5 bg-dark border border-dark-border rounded-md text-xs text-white focus:outline-none focus:border-accent-light"
              />
              <label className="px-4 py-2 rounded-md bg-dark hover:bg-dark-elevated text-ink-light text-xs font-semibold border border-dark-border cursor-pointer flex items-center justify-center gap-2">
                <Upload className="w-3.5 h-3.5 text-accent-light" />
                <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
                <input type="file" onChange={handleFileSelect} className="hidden" accept="image/*" ref={fileInputRef} />
              </label>
              {isEditing && formData.image_url && (
                <button
                  type="button"
                  onClick={() => handleReposition(formData.image_url)}
                  className="px-4 py-2 rounded-md bg-dark hover:bg-dark-elevated text-accent-light text-xs font-semibold border border-accent/30 flex items-center justify-center gap-2 transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Reposition
                </button>
              )}
            </div>
            {isEditing && formData.image_url && (
              <div className="mt-3">
                <img
                  src={formData.image_url}
                  alt="Current"
                  className="h-20 rounded-md border border-dark-border object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-light-secondary mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short note about the photo context..."
              className="w-full px-3.5 py-2.5 bg-dark border border-dark-border rounded-md text-xs text-white focus:outline-none focus:border-accent-light resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-dark-border">
            <Button type="submit" variant="darkPrimary" size="md" icon={false}>
              {isEditing ? 'Save Changes' : 'Add Photo to Archive'}
            </Button>
            {isEditing && (
              <Button type="button" onClick={handleResetForm} variant="dark" size="md" icon={false}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-lg bg-dark-surface border border-dark-border overflow-hidden"
          >
            <div className="h-40 bg-dark">
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <span className="text-[10px] font-mono font-bold text-accent-light uppercase">{item.category}</span>
              <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
            </div>
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <button
                onClick={() => handleEdit(item)}
                className="p-1.5 rounded bg-dark/80 text-gold-dark hover:bg-dark-elevated transition-colors"
                title="Edit Photo"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded bg-dark/80 text-rose-400 hover:bg-rose-950 transition-colors"
                title="Delete Photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Image Cropper Modal — new upload */}
      {cropperFile && (
        <ImageCropper
          file={cropperFile}
          onApply={handleCropperApply}
          onCancel={handleCropperCancel}
        />
      )}

      {/* Image Cropper Modal — reposition existing */}
      {repositionUrl && (
        <ImageCropper
          imageUrl={repositionUrl}
          onApply={handleCropperApply}
          onCancel={handleCropperCancel}
        />
      )}
    </div>
  );
}

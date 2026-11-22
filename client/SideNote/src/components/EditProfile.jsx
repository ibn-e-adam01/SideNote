import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPen, faCheck } from '@fortawesome/free-solid-svg-icons';

const EditProfile = ({
  initialData,
  onClose,
  onSave,
  saving = false,
  handleProfileUpdate
}) => {
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    tagname: initialData?.tagname || '',
    bio: initialData?.bio || ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({
      username: initialData?.username || '',
      tagname: initialData?.tagname || '',
      bio: initialData?.bio || ''
    });
  }, [initialData]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !saving) onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, saving]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    handleProfileUpdate(formData);

    const cleanedData = {
      username: formData.username.trim(),
      tagname: formData.tagname.trim().replace(/^@/, ''),
      bio: formData.bio.trim()
    };

    if (!cleanedData.username || !cleanedData.tagname) {
      setError('Name and username cannot be empty.');
      return;
    }

    if (cleanedData.username.length > 40) {
      setError('Name cannot exceed 40 characters.');
      return;
    }

    if (cleanedData.tagname.length > 30) {
      setError('Username cannot exceed 30 characters.');
      return;
    }

    try {
      await onSave(cleanedData);
    } catch (err) {
      setError(err?.message || 'Unable to update profile.');
    }
  };

  const initials = formData.username
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('') || 'U';

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">
              Edit Profile
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Update how people see you on SideNote.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-white transition disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Avatar preview */}
          <div className="flex flex-col items-center py-6">
            <div className="w-20 h-20 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-2xl font-semibold text-zinc-200">
              {initials}
            </div>

            <span className="text-xs text-zinc-500 mt-3">
              Profile preview
            </span>
          </div>

          <div className="px-5 pb-5 flex flex-col gap-5">

            {/* Display name */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Display Name
              </label>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                maxLength={40}
                placeholder="Your name"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-zinc-400 transition"
              />

              <p className="text-right text-[11px] text-zinc-600 mt-1">
                {formData.username.length}/40
              </p>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Username
              </label>

              <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-xl px-4 focus-within:border-zinc-400 transition">
                <span className="text-zinc-500 text-sm">@</span>

                <input
                  type="text"
                  name="tagname"
                  value={formData.tagname}
                  onChange={handleChange}
                  maxLength={30}
                  placeholder="username"
                  className="w-full bg-transparent px-2 py-3 text-sm text-white placeholder:text-zinc-600 outline-none"
                />
              </div>

              <p className="text-right text-[11px] text-zinc-600 mt-1">
                {formData.tagname.replace(/^@/, '').length}/30
              </p>
            </div>

            {/* Bio */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-zinc-300">
                  Bio
                </label>

                <span className="text-[11px] text-zinc-600">
                  {formData.bio.length}/160
                </span>
              </div>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                maxLength={160}
                rows={3}
                placeholder="Tell people a little about yourself..."
                className="w-full resize-none bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-zinc-400 transition"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-zinc-800 bg-zinc-950">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 rounded-full text-sm text-zinc-300 hover:bg-zinc-800 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-full bg-zinc-100 text-zinc-950 text-sm font-semibold hover:bg-white transition active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faCheck} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
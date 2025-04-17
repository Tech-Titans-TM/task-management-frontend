import { useState } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useNavigate } from 'react-router-dom';
import api from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
export default function Settings() {
  const { user, setUser, logout } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.put(`/users/${user.userId}`, {
        firstName,
        lastName,
        email
      });
      const updatedUser = {
        ...data,
        userId: data._id
      };
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/users/${user.userId}`);
      toast.success('Account deleted successfully!');
      await logout();
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Error deleting account:', err);
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="w-full max-w-sm shadow-xl bg-base-100 rounded-box p-8">
        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              className="input input-bordered"
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
          </div>

          {/* Last Name */}
          <div className="form-control">
            <label className="label">Last Name</label>
            <input
              className="input input-bordered"
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label">Email</label>
            <input
              className="input input-bordered"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Update'}
          </button>

        </form>

        {/* 🔴 Delete Account Button */}
        <div className="mt-6">
          <button
            className="btn btn-error btn-outline w-full"
            onClick={() => setShowConfirm(true)}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* 🔒 Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-lg">
            <h3 className="text-lg text-primary font-bold mb-4">Are you sure?</h3>
            <p className="mb-6 text-sm text-gray-600">
              This will permanently delete your account. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button className="btn btn-primary btn-outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={handleDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

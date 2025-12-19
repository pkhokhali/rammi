'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Save, X } from 'lucide-react';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface WorkoutEditorProps {
  workout?: {
    id: number;
    title: string;
    description: string;
    content: string;
    duration: string;
    difficulty: string;
    workout_type: string;
  };
}

export default function WorkoutEditor({ workout }: WorkoutEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(workout?.title || '');
  const [description, setDescription] = useState(workout?.description || '');
  const [content, setContent] = useState(workout?.content || '');
  const [duration, setDuration] = useState(workout?.duration || '');
  const [difficulty, setDifficulty] = useState(workout?.difficulty || 'beginner');
  const [workoutType, setWorkoutType] = useState(workout?.workout_type || 'home');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const response = await fetch(workout ? `/api/admin/workouts/${workout.id}` : '/api/admin/workouts', {
        method: workout ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          content,
          duration,
          difficulty,
          workout_type: workoutType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/workouts');
        router.refresh();
      } else {
        setError(data.error || 'Failed to save workout');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Workout title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Short description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={quillModules}
            theme="snow"
            className="bg-white"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration *
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 30 minutes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty *
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workout Type *
            </label>
            <select
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="home">Home Workout</option>
              <option value="gym">Gym Workout</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition inline-flex items-center"
          >
            <X className="h-5 w-5 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
          >
            <Save className="h-5 w-5 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );
}


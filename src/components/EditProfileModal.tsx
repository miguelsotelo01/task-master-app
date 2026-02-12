import { useState } from "react";
import { X, Camera, Save, Loader2, Lock } from "lucide-react"; // Importamos Lock
import { useProfileStore } from "../store/useProfileStore";
import { supabase } from "../lib/supabase"; // Necesitamos supabase directo para auth

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: Props) {
  const { profile, updateProfile, uploadAvatar, loading } = useProfileStore();

  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [jobTitle, setJobTitle] = useState(profile?.job_title || "");
  const [password, setPassword] = useState(""); // 👈 Nuevo estado para clave
  const [uploading, setUploading] = useState(false);

  if (!isOpen || !profile) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Actualizar Datos del Perfil (Tabla Publica)
    await updateProfile({ full_name: fullName, job_title: jobTitle });

    // 2. Actualizar Contraseña (Si el usuario escribió algo)
    if (password.trim()) {
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) {
        alert("Error al cambiar contraseña: " + error.message);
      } else {
        alert("¡Perfil y contraseña actualizados!");
      }
    }

    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    await uploadAvatar(e.target.files[0]);
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Editar Perfil
        </h2>

        <div className="flex flex-col items-center mb-8">
          {/* Avatar Upload */}
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg bg-gray-100">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-blue-500 to-purple-600 text-white text-3xl font-bold">
                  {profile.full_name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              {uploading ? (
                <Loader2 className="animate-spin text-white" />
              ) : (
                <Camera className="text-white" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Toca para cambiar foto
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título / Cargo
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
            />
          </div>

          {/* 👇 Nuevo Campo de Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
              <Lock size={14} /> Nueva Contraseña (Opcional)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white placeholder:text-gray-400"
              placeholder="Dejar vacío para no cambiar"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg shadow-blue-500/20"
          >
            <Save size={18} />
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}

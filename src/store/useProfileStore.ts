import { create } from "zustand";
import { supabase } from "../lib/supabase";

export interface Profile {
  id: string;
  full_name: string | null;
  job_title: string | null;
  avatar_url: string | null;
}

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  loading: false,

  // 1. OBTENER PERFIL
  fetchProfile: async () => {
    set({ loading: true });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      set({ profile: data });
    }
    set({ loading: false });
  },

  // 2. ACTUALIZAR TEXTOS (Nombre, Título)
  updateProfile: async (updates) => {
    const { profile } = get();
    if (!profile) return;

    // Actualizamos localmente primero (Optimismo)
    set({ profile: { ...profile, ...updates } });

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profile.id);

    if (error) {
      console.error("Error actualizando perfil:", error);
      // Si falla, podrías revertir aquí, pero por simplicidad lo dejamos así
    }
  },

  // 3. SUBIR FOTO (La parte compleja)
  uploadAvatar: async (file) => {
    const { profile } = get();
    if (!profile) return;

    try {
      set({ loading: true });

      // a. Crear nombre único para el archivo (ej: user-123/avatar.png)
      const fileExt = file.name.split(".").pop();
      const filePath = `${profile.id}/avatar.${fileExt}`;

      // b. Subir al Bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // c. Obtener la URL Pública
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // d. Guardar la URL en la tabla 'profiles'
      await get().updateProfile({ avatar_url: publicUrl });
    } catch (error) {
      console.error("Error subiendo avatar:", error);
      alert("Error al subir la imagen");
    } finally {
      set({ loading: false });
    }
  },
}));

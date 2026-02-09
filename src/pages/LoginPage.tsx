import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { supabase } from "../lib/supabase"; // Importamos la conexión real

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); // Estado para mostrar errores
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(""); // Limpiar errores previos

    try {
      if (isSignUp) {
        // --- REGISTRO ---
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("¡Cuenta creada con éxito! Ahora ingresarás automáticamente.");
        // Supabase inicia sesión solo tras registrarse si no requiere confirmación
      } else {
        // --- LOGIN ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
      // Si no hubo error, App.tsx detectará el cambio de sesión y nos redirigirá
      navigate("/");
    } catch (error: any) {
      console.error(error);
      setErrorMsg(
        error.message === "Invalid login credentials"
          ? "Credenciales incorrectas. Verifica tu correo o contraseña."
          : error.message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header Visual */}
        <div className="bg-blue-600 p-8 text-center relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-white/10 rotate-12 transform pointer-events-none"></div>
          <h1 className="text-3xl font-bold text-white relative z-10">
            Task Master
          </h1>
          <p className="text-blue-100 text-sm mt-2 relative z-10">
            Tu productividad, sincronizada.
          </p>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            {isSignUp ? "Crear Cuenta" : "Bienvenido de nuevo"}
          </h2>

          {/* Mensaje de Error */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="relative">
              <Mail
                className="absolute left-4 top-3.5 text-gray-400"
                size={20}
              />
              <input
                type="email"
                placeholder="tu@correo.com"
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock
                className="absolute left-4 top-3.5 text-gray-400"
                size={20}
              />
              <input
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Registrarse" : "Ingresar"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {isSignUp ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMsg("");
                }}
                className="ml-2 text-blue-600 font-bold hover:underline"
              >
                {isSignUp ? "Inicia Sesión" : "Regístrate"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

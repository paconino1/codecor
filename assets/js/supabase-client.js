/**
 * Codecor Rota el Porteño
 * supabase-client.js - Configuración del cliente Supabase
 */

// Supabase Project Configuration
const SUPABASE_URL = 'https://eelpjlursutzyzcowjwl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_XveeowvcYcUwfrVWKhbuIQ_SUExS4hy';

// Se asume que la librería de Supabase se carga vía CDN en el HTML:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

let supabaseInstance = null;

// Para usar con el CDN:
function getSupabaseClient() {
    if (!window.supabase) {
        console.error("Supabase CDN no está cargado.");
        return null;
    }
    if (!supabaseInstance) {
        supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return supabaseInstance;
}

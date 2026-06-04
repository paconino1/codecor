-- ==========================================
-- Codecor Rota el Porteño - Esquema Supabase
-- ==========================================
-- Ejecuta este script en el "SQL Editor" de tu proyecto de Supabase.

-- 1. Tabla de Propiedades (Inmuebles)
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price TEXT NOT NULL,
    status TEXT CHECK (status IN ('venta', 'alquiler')) NOT NULL,
    image_url TEXT
);

-- 2. Tabla de Servicios
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    icon TEXT NOT NULL
);

-- 3. Tabla de Mensajes (Formulario de Contacto)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    service_type TEXT NOT NULL,
    message TEXT NOT NULL
);

-- ==========================================
-- Políticas de Seguridad (Row Level Security)
-- ==========================================
-- Activamos RLS para todas las tablas
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Políticas para 'properties'
-- Cualquiera (público) puede leer las propiedades
CREATE POLICY "Public profiles are viewable by everyone." ON public.properties
    FOR SELECT USING (true);
-- Solo usuarios autenticados (admin) pueden insertar, actualizar o borrar
CREATE POLICY "Admins can insert properties." ON public.properties
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update properties." ON public.properties
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete properties." ON public.properties
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para 'services'
-- Cualquiera puede leer
CREATE POLICY "Services viewable by everyone." ON public.services
    FOR SELECT USING (true);
-- Solo admin puede modificar
CREATE POLICY "Admins can manage services." ON public.services
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para 'messages'
-- Cualquiera (público) puede insertar (enviar mensajes desde el formulario)
CREATE POLICY "Anyone can insert messages." ON public.messages
    FOR INSERT WITH CHECK (true);
-- Solo admin puede leer, actualizar o borrar los mensajes
CREATE POLICY "Admins can view messages." ON public.messages
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage messages." ON public.messages
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete messages." ON public.messages
    FOR DELETE USING (auth.role() = 'authenticated');

-- ==========================================
-- Datos de demostración iniciales (Opcional)
-- ==========================================
INSERT INTO public.properties (title, description, price, status, image_url) VALUES 
('Edificio Corporativo Norte', 'Moderno edificio de oficinas con certificación LEED, ubicado en el distrito financiero.', '4.500.000', 'venta', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop'),
('Oficina Ejecutiva Premium', 'Planta completa de oficinas con vistas panorámicas, ideal para sedes regionales.', '12.000', 'alquiler', 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop');

INSERT INTO public.services (name, icon) VALUES 
('Inmobiliaria', 'real_estate_agent'),
('Inversiones', 'trending_up'),
('Construcción', 'construction'),
('Mantenimiento', 'engineering'),
('Seguros', 'shield');

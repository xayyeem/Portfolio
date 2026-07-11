import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';

/* ---------- Profile ---------- */
export function useProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .maybeSingle();
      if (!active) return;
      if (error) setError(error.message);
      else setData(data);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  return { data, loading, error };
}

/* ---------- Experiences ---------- */
export function useExperiences() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: false });
      if (!active) return;
      if (error) setError(error.message);
      else setData(data || []);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  return { data, loading, error };
}

/* ---------- Skills ---------- */
export function useSkills() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from('skill_categories')
        .select('*, skills(*)')
        .eq('is_published', true)
        .order('display_order', { ascending: true });
      if (!active) return;
      if (error) setError(error.message);
      else setData(data || []);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  return { data, loading, error };
}

/* ---------- Projects ---------- */
export function useProjects() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });
      if (!active) return;
      if (error) setError(error.message);
      else setData(data || []);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  return { data, loading, error };
}

/* ---------- Services ---------- */
export function useServices() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });
      if (!active) return;
      if (error) setError(error.message);
      else setData(data || []);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  return { data, loading, error };
}

/* ---------- Social Links ---------- */
export function useSocials() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });
      if (!active) return;
      if (error) setError(error.message);
      else setData(data || []);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  return { data, loading, error };
}

/* ---------- Site Settings ---------- */
export function useSiteSettings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .maybeSingle();
      if (!active) return;
      if (error) setError(error.message);
      else setData(data);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  return { data, loading, error };
}

/* ---------- Contact Messages (admin) ---------- */
export function useContactMessages() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setData(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

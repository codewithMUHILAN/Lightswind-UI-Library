
import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';

interface TemplateStats {
  views: number;
  downloads: number;
  bought_count: number;
  avg_rating: number | null;
}

export const useTemplateStats = (templateId: string) => {
  const [stats, setStats] = useState<TemplateStats>({
    views: 0,
    downloads: 0,
    bought_count: 0,
    avg_rating: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('templates')
        .select('stats, avg_rating')
        .eq('id', templateId)
        .single();

      if (!error && data) {
        setStats({
          views: data.stats?.views || 0,
          downloads: data.stats?.downloads || 0,
          bought_count: data.stats?.bought_count || 0,
          avg_rating: data.avg_rating
        });
      }
      setIsLoading(false);
    };

    fetchStats();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('template-stats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'templates',
          filter: `id=eq.${templateId}`
        },
        (payload) => {
          const newData = payload.new as any;
          if (newData) {
            setStats({
              views: newData.stats?.views || 0,
              downloads: newData.stats?.downloads || 0,
              bought_count: newData.stats?.bought_count || 0,
              avg_rating: newData.avg_rating
            });
          }
        }
      )
      .subscribe();

    // Increment view count when component mounts
    const incrementViewCount = async () => {
      try {
        // First get current stats
        const { data, error } = await supabase
          .from('templates')
          .select('stats')
          .eq('id', templateId)
          .single();
          
        if (error) throw error;
        
        // Update the views count
        const currentStats = data?.stats || {};
        // Fix: Verify currentStats is a proper object before spreading
        if (typeof currentStats === 'object' && currentStats !== null) {
          const currentViews = currentStats.views || 0;
          
          const { error: updateError } = await supabase
            .from('templates')
            .update({
              stats: {
                ...currentStats,
                views: currentViews + 1
              }
            })
            .eq('id', templateId);
            
          if (updateError) throw updateError;
        }
      } catch (error) {
        console.error('Error incrementing view count:', error);
      }
    };

    // Only increment view count on client side, not during SSR
    if (typeof window !== 'undefined') {
      incrementViewCount();
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [templateId]);

  return { stats, isLoading };
};

// Helper function to calculate satisfaction percentage
export const calculateSatisfactionPercentage = (rating: number | null): number => {
  if (!rating) return 0;
  // Convert rating from 0-5 scale to 0-100 percentage
  return Math.round((rating / 5) * 100);
};

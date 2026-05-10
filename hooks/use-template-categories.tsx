
import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Home, LayoutGrid, ShoppingCart, LogIn, Book, Layers, Box } from 'lucide-react';

interface TemplateCategory {
  name: string;
  icon: React.ElementType;
  count: number;
}

// Map category names to their corresponding icons
const categoryIconMap: Record<string, React.ElementType> = {
  'Web Application': LayoutGrid,
  'Web Design': Home,
  'E-Commerce': ShoppingCart,
  'Marketing': Book,
  'Content Management': Layers,
  'Business': Box,
  'Authentication': LogIn,
  // Add more category mappings as needed
};

export function useTemplateCategories() {
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        
        // Fetch unique categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('templates')
          .select('category')
          .order('category');
        
        if (categoriesError) throw new Error(categoriesError.message);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(
          categoriesData.map(item => item.category as string)
        )).filter(Boolean) as string[];
        
        // Fetch count for each category
        const categoryWithCounts = await Promise.all(
          uniqueCategories.map(async (category) => {
            const { data, error: countError } = await supabase
              .from('templates')
              .select('id')
              .eq('category', category);
              
            if (countError) throw new Error(countError.message);
            
            const count = data?.length || 0;
            const icon = categoryIconMap[category] || Box; // Default to Box if no icon found
            
            return {
              name: category,
              icon,
              count
            } as TemplateCategory;
          })
        );
        
        setCategories(categoryWithCounts);
      } catch (err) {
        console.error('Error fetching template categories:', err);
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('public:templates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'templates' 
      }, () => {
        // Refetch categories on any change to templates table
        fetchCategories();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { categories, loading, error };
}

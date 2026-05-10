
import { supabase } from '../integrations/supabase/client';

/**
 * Updates all templates in the database to include the creator field
 * This script should be run once to migrate existing data
 */
export async function updateTemplatesCreator(): Promise<void> {
  try {
    console.log('Starting update of templates to add creator field...');
    
    // Update all templates to add the creator field
    const { data, error } = await supabase
      .from('templates')
      .update({ creator: '@codewithmuhilan' })
      .is('creator', null); // Only update where creator is null
    
    if (error) {
      throw error;
    }
    
    console.log(`Successfully updated templates with creator field`);
    return;
  } catch (error) {
    console.error('Error updating templates with creator field:', error);
  }
}

// Run when imported directly
if (import.meta.url.endsWith('update-templates-creator.ts')) {
  updateTemplatesCreator()
    .then(() => console.log('Template creator update completed.'))
    .catch(console.error);
}

import { supabase } from '../integrations/supabase/client';



export const seedTemplates = async () => {
  try {
    // Check if templates are already seeded
    const { data, error } = await supabase
      .from('templates')
      .select('id')
      .limit(1);
      
    if (error) {
      console.error('Error checking for existing templates:', error);
      throw error;
    }
    
    // If templates already exist, don't seed
    if (data && data.length > 0) {
      console.log('Templates already seeded, found:', data.length, 'templates');
      return;
    }
    
    console.log('No templates found. Please add templates through the database directly.');
    // No automatic template seeding anymore - templates should be added through the database
    
    // Verify templates were inserted
    const { data: verifyData, error: verifyError } = await supabase
      .from('templates')
      .select('*');
      
    if (verifyError) {
      console.error('Error verifying templates:', verifyError);
    } else {
      console.log(`Found ${verifyData.length} templates in database.`);
      if (verifyData.length > 0) {
        console.log('Sample template data:', verifyData[0]);
      }
    }
  } catch (error) {
    console.error('Error in seedTemplates function:', error);
  }
};

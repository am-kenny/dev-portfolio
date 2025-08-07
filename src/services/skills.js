import config from './config.js';
import { authService } from './auth.js';

/**
 * Skills service for managing hierarchical skills system
 */

// Get skills structure information
export const getSkillsStructure = async () => {
  try {
    const response = await fetch(config.getApiUrl(config.endpoints.skillsStructure));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching skills structure:', error);
    throw error;
  }
};

// Get current skills categorization settings
export const getSkillsCategorization = async () => {
  try {
    const token = authService.getToken();
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(config.getApiUrl(config.endpoints.skillsCategorization), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        // Return default settings if no categorization exists yet
        return {
          useSubcategories: true,
          minSkillsForSubcategory: 3,
          categoryOverrides: {}
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching skills categorization:', error);
    // Return default settings on any error
    return {
      useSubcategories: true,
      minSkillsForSubcategory: 3,
      categoryOverrides: {}
    };
  }
};

// Get flattened skills for backward compatibility
export const getFlattenedSkills = async () => {
  try {
    const response = await fetch(config.getApiUrl(config.endpoints.skillsFlat));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching flattened skills:', error);
    throw error;
  }
};

// Configure skills categorization
export const configureSkillsCategorization = async (categorization) => {
  try {
    const token = authService.getToken();
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(config.getApiUrl(config.endpoints.skillsCategorization), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ categorization })
    });
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (response.status === 401) {
        throw new Error('Unauthorized. Please check your credentials.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error configuring skills categorization:', error);
    throw error;
  }
};

// Helper function to flatten hierarchical skills
export const flattenSkills = (skillCategories) => {
  const flattened = {};
  
  Object.entries(skillCategories).forEach(([category, skills]) => {
    if (Array.isArray(skills)) {
      // Already flat
      flattened[category] = skills;
    } else if (typeof skills === 'object') {
      // Hierarchical - flatten all subcategories
      const allSkills = [];
      Object.values(skills).forEach(subcategorySkills => {
        if (Array.isArray(subcategorySkills)) {
          allSkills.push(...subcategorySkills);
        }
      });
      flattened[category] = allSkills;
    }
  });
  
  return flattened;
};

// Helper function to check if skills are hierarchical
export const isHierarchical = (skills) => {
  if (!skills || typeof skills !== 'object') return false;
  
  return Object.values(skills).some(skillGroup => 
    typeof skillGroup === 'object' && !Array.isArray(skillGroup)
  );
};

// Helper function to get all skills from hierarchical structure
export const getAllSkills = (skillCategories) => {
  const allSkills = [];
  
  Object.entries(skillCategories).forEach(([category, skills]) => {
    if (Array.isArray(skills)) {
      // Flat structure
      allSkills.push(...skills);
    } else if (typeof skills === 'object') {
      // Hierarchical structure
      Object.values(skills).forEach(subcategorySkills => {
        if (Array.isArray(subcategorySkills)) {
          allSkills.push(...subcategorySkills);
        }
      });
    }
  });
  
  return allSkills;
}; 
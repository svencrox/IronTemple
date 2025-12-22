// Storage Service - Centralized localStorage access with error handling

/**
 * Get item from localStorage with JSON parsing
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist or parsing fails
 * @returns {*} Parsed value or defaultValue
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading from localStorage (key: ${key}):`, error);
    return defaultValue;
  }
};

/**
 * Set item in localStorage with JSON stringification
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export const setItem = (key, value) => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Consider clearing old data.');
    } else {
      console.error(`Error writing to localStorage (key: ${key}):`, error);
    }
    return false;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (key: ${key}):`, error);
    return false;
  }
};

/**
 * Clear all IronTemple app data (preserves auth token)
 * @returns {boolean} Success status
 */
export const clearAppData = () => {
  try {
    const authData = getItem('user');
    localStorage.clear();
    if (authData) {
      setItem('user', authData);
    }
    return true;
  } catch (error) {
    console.error('Error clearing app data:', error);
    return false;
  }
};

/**
 * Get estimated storage usage statistics
 * @returns {Object} Storage stats
 */
export const getStorageStats = () => {
  try {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }

    // Rough estimates (actual limits vary by browser)
    const estimatedLimit = 5 * 1024 * 1024; // 5MB
    const usagePercentage = (totalSize / estimatedLimit) * 100;

    return {
      totalBytes: totalSize,
      totalKB: (totalSize / 1024).toFixed(2),
      totalMB: (totalSize / (1024 * 1024)).toFixed(2),
      usagePercentage: usagePercentage.toFixed(2),
      isNearLimit: usagePercentage > 80
    };
  } catch (error) {
    console.error('Error calculating storage stats:', error);
    return null;
  }
};

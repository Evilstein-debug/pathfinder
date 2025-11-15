import Supermemory from "supermemory";
import "dotenv/config";

const supermemory = new Supermemory(process.env.SUPERMEMORY_API_KEY);

// In-memory cache to track memory IDs by pathId
const memoryCache = new Map();

// Store path generation context
export const storePathMemory = async (userId, pathId, pathData) => {
  try {
    const memoryContent = `
        User ID: ${userId}
        Path ID: ${pathId}
        Path Title: ${pathData.title}
        Goal Type: ${pathData.goalType}
        Timeframe: ${pathData.timeframe} ${pathData.goalType === "shortTerm" ? "months" : "years"}
        Feasibility Score: ${pathData.feasibilityScore}
        User Description: ${pathData.userGoalDescription || "Not provided"}
        Last Updated: ${new Date().toISOString()}

        Checkpoints:
        ${pathData.checkpoints.map((cp, i) => 
        `${i + 1}. ${cp.title} (${cp.duration})
        Description: ${cp.description}`
        ).join('\n\n')}
        `;

    const result = await supermemory.memories.add({
      content: memoryContent,
      spaces: ["pathfinder"],
      metadata: { userId, pathId, type: "learning_path" },
      containerTag: userId
    });

    // Cache the memory ID for faster retrieval
    if (result && result.id) {
      memoryCache.set(pathId, result.id);
      console.log(`Memory stored for pathId: ${pathId} with ID: ${result.id}`);
    } else {
      console.log(`Memory stored for pathId: ${pathId}`);
    }

    return { success: true, memoryId: result?.id };
  } catch (error) {
    console.error("Supermemory store error:", error);
    return { success: false, error: error.message };
  }
};

// Update existing memory for path regeneration
export const updatePathMemory = async (userId, pathId, pathData) => {
  try {
    let memoryId = null;

    // First, try to get from cache
    const cachedMemoryId = memoryCache.get(pathId);
    
    if (cachedMemoryId) {
      console.log(`Found memory in cache for pathId: ${pathId}`);
      memoryId = cachedMemoryId;
    } else {
      // If not in cache, search for it
      console.log("🔍 Searching for memory...");
      
      const searchResults = await supermemory.search.documents({
        q: pathId, // Search directly with pathId
        limit: 20,
        containerTags: [userId],
        rerank: true
      });

      console.log("Search results:", JSON.stringify(searchResults, null, 2));

      if (searchResults && searchResults.results && searchResults.results.length > 0) {
         // Try to find matching memory
        for (const result of searchResults.results) {
          const content = result.memory || result.content || result.chunks || "";
          if (content.includes(pathId)) {
            memoryId = result.id || result.uuid || result._id;
            console.log(`Found memory with ID: ${memoryId}`);
            // Cache it for future use
            memoryCache.set(pathId, memoryId);
            break;
          }
        }
      }
    }

    if (!memoryId) {
      console.log("No existing memory found, creating new one");
      return await storePathMemory(userId, pathId, pathData);
    }

    // Create updated memory content
    const memoryContent = `
        User ID: ${userId}
        Path ID: ${pathId}
        Path Title: ${pathData.title}
        Goal Type: ${pathData.goalType}
        Timeframe: ${pathData.timeframe} ${pathData.goalType === "shortTerm" ? "months" : "years"}
        Feasibility Score: ${pathData.feasibilityScore}
        User Description: ${pathData.userGoalDescription || "Not provided"}
        Last Updated: ${new Date().toISOString()}
        Version: REGENERATED

        Checkpoints:
        ${pathData.checkpoints.map((cp, i) => 
        `${i + 1}. ${cp.title} (${cp.duration})
        Description: ${cp.description}`
        ).join('\n\n')}
        `;

    // Update the memory
    await supermemory.memories.update(memoryId, {
      content: memoryContent,
      spaces: ["pathfinder"],
      metadata: { userId, pathId, type: "learning_path", lastUpdated: new Date().toISOString() }
    });

    console.log(`Memory updated for pathId: ${pathId}`);
    return { success: true };
  } catch (error) {
    console.error("Supermemory update error:", error);
    // Fallback: create new memory
    console.log("Update failed, path doesn't exist: ", pathId);
  }
};

// Retrieve context for path regeneration
export const getPathMemory = async (userId, pathId) => {
  try {
    // First check cache
    const cachedMemoryId = memoryCache.get(pathId);
    
    if (cachedMemoryId) {
      console.log(`Checking cached memory for pathId: ${pathId}`);
      try {
        const memory = await supermemory.memories.get(cachedMemoryId);
        if (memory && memory.content) {
          const content = memory.content;
          console.log(`Memory retrieved from cache for pathId: ${pathId}`);
          return { success: true, context: content };
        }
      } catch (err) {
        console.log("Cached memory not found, searching...");
        memoryCache.delete(pathId);
      }
    }

    // Search with pathId
    console.log(`Searching memories for pathId: ${pathId}`);
    
    const results = await supermemory.search.documents({
      q: pathId,
      limit: 20,
      containerTags: [userId],
      rerank: true
    });

    console.log(`Search found ${results?.results?.length || 0} results`);

    if (!results || !results.results || results.results.length === 0) {
      console.log("No memory found for pathId:", pathId);
      return { success: false, message: "No memory found" };
    }

    // Find exact match
    for (const result of results.results) {
      const content = result.memory || result.content || "";
      
      if (content && content.includes(pathId)) {
        console.log(`Memory found for pathId: ${pathId}`);
        
        // Cache it
        const memoryId = result.id || result.uuid || result._id;
        if (memoryId) {
          memoryCache.set(pathId, memoryId);
        }
        
        return { success: true, context: content };
      }
    }

    console.log("No matching memory found for pathId:", pathId);
    return { success: false, message: "No memory found" };
  } catch (error) {
    console.error("Supermemory retrieve error:", error);
    return { success: false, error: error.message };
  }
};

// Get user's path generation history
export const getUserPathHistory = async (userId) => {
  try {
    const results = await supermemory.search.documents({
      q: userId,
      limit: 20,
      containerTags: [userId],
      rerank: true
    });

    if (!results || !results.results || results.results.length === 0) {
      return {
        success: true,
        memories: []
      };
    }

    const memories = results.results
      .map(r => r.memory || r.content || r.document || "")
      .filter(content => content && content.includes(userId));

    return {
      success: true,
      memories
    };
  } catch (error) {
    console.error("Supermemory history error:", error);
    return { success: false, error: error.message };
  }
};

// Clear cache entry (call this when deleting a path)
export const clearMemoryCache = (pathId) => {
  memoryCache.delete(pathId);
  console.log(`Cleared cache for pathId: ${pathId}`);
};

// Get cache stats (for debugging)
export const getCacheStats = () => {
  return {
    size: memoryCache.size,
    keys: Array.from(memoryCache.keys())
  };
};
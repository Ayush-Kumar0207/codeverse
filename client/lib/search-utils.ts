import { AlgorithmEntry } from "@/data/algos/types";

export function fuzzySearchAlgorithms(query: string, algorithms: AlgorithmEntry[]) {
  if (!query) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return algorithms
    .map(algo => {
      let score = 0;
      const title = algo.title.toLowerCase();
      const topic = algo.topic.toLowerCase();
      const id = algo.id.toLowerCase();
      
      if (title.includes(normalizedQuery)) score += 10;
      if (id.includes(normalizedQuery)) score += 5;
      if (topic.includes(normalizedQuery)) score += 3;
      
      // Exact match bonus
      if (title === normalizedQuery) score += 20;
      
      return { algo, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.algo);
}

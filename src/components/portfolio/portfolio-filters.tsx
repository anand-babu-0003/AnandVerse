"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  X, 
  Grid3X3, 
  List,
  SortAsc,
  SortDesc,
  Tag,
  Calendar,
  Star
} from 'lucide-react';
import type { PortfolioItem } from '@/lib/types';

interface PortfolioFiltersProps {
  portfolioItems: PortfolioItem[];
  onFilteredItems: (items: PortfolioItem[]) => void;
}

type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'featured';
type ViewMode = 'grid' | 'list';

export function PortfolioFilters({ portfolioItems, onFilteredItems }: PortfolioFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    portfolioItems.forEach(item => {
      item.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [portfolioItems]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = portfolioItems.filter(item => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Tag filter
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(selectedTag => item.tags.includes(selectedTag));

      return matchesSearch && matchesTags;
    });

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || b.updatedAt || '').getTime() - 
                 new Date(a.createdAt || a.updatedAt || '').getTime();
        case 'oldest':
          return new Date(a.createdAt || a.updatedAt || '').getTime() - 
                 new Date(b.createdAt || b.updatedAt || '').getTime();
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        case 'featured':
          // You could add a featured field to PortfolioItem
          return 0;
        default:
          return 0;
      }
    });

    return filtered;
  }, [portfolioItems, searchTerm, selectedTags, sortBy]);

  // Update parent component when filters change
  useMemo(() => {
    onFilteredItems(filteredAndSortedItems);
  }, [filteredAndSortedItems, onFilteredItems]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setSortBy('newest');
  };

  const hasActiveFilters = searchTerm !== '' || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {selectedTags.length + (searchTerm ? 1 : 0)}
              </Badge>
            )}
          </Button>
          
          <div className="flex items-center border border-input rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="card-modern">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Sort Options */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Sort by
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'newest', label: 'Newest', icon: SortDesc },
                    { value: 'oldest', label: 'Oldest', icon: SortAsc },
                    { value: 'name-asc', label: 'Name A-Z', icon: SortAsc },
                    { value: 'name-desc', label: 'Name Z-A', icon: SortDesc },
                    { value: 'featured', label: 'Featured', icon: Star },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={sortBy === option.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy(option.value as SortOption)}
                      className="flex items-center gap-2"
                    >
                      <option.icon className="h-3 w-3" />
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Technologies & Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => toggleTag(tag)}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 pt-4 border-t">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {searchTerm && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Search: "{searchTerm}"
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setSearchTerm('')}
                      />
                    </Badge>
                  )}
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => toggleTag(tag)}
                      />
                    </Badge>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredAndSortedItems.length} of {portfolioItems.length} projects
        </span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}

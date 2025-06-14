
import React from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useSavedProperties } from '@/hooks/useSavedProperties'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  propertyId: string
  size?: 'sm' | 'lg'
  className?: string
}

const FavoriteButton = ({ propertyId, size = 'sm', className }: FavoriteButtonProps) => {
  const { isSaved, toggleSavedProperty, loading } = useSavedProperties()
  const saved = isSaved(propertyId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleSavedProperty(propertyId)
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "hover:bg-white/20 transition-colors",
        size === 'sm' ? 'h-8 w-8 p-0' : 'h-10 w-10 p-0',
        className
      )}
    >
      <Heart 
        className={cn(
          size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
          saved ? 'fill-red-500 text-red-500' : 'text-white',
          loading && 'opacity-50'
        )} 
      />
    </Button>
  )
}

export default FavoriteButton


import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export const useSavedProperties = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [savedPropertyIds, setSavedPropertyIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchSavedProperties()
    } else {
      setSavedPropertyIds(new Set())
    }
  }, [user])

  const fetchSavedProperties = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('saved_properties')
        .select('property_id')
        .eq('user_id', user.id)

      if (error) throw error

      const ids = new Set(data?.map(item => item.property_id) || [])
      setSavedPropertyIds(ids)
    } catch (error) {
      console.error('Error fetching saved properties:', error)
    }
  }

  const toggleSavedProperty = async (propertyId: string) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save properties.',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    const isSaved = savedPropertyIds.has(propertyId)

    try {
      if (isSaved) {
        const { error } = await supabase
          .from('saved_properties')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId)

        if (error) throw error

        setSavedPropertyIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(propertyId)
          return newSet
        })

        toast({
          title: 'Property removed',
          description: 'Property removed from your favorites.'
        })
      } else {
        const { error } = await supabase
          .from('saved_properties')
          .insert({
            user_id: user.id,
            property_id: propertyId
          })

        if (error) throw error

        setSavedPropertyIds(prev => new Set([...prev, propertyId]))

        toast({
          title: 'Property saved',
          description: 'Property added to your favorites.'
        })
      }
    } catch (error: any) {
      console.error('Error toggling saved property:', error)
      toast({
        title: 'Error',
        description: 'Failed to update favorites. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const isSaved = (propertyId: string) => savedPropertyIds.has(propertyId)

  return {
    savedPropertyIds,
    isSaved,
    toggleSavedProperty,
    loading,
    refetch: fetchSavedProperties
  }
}

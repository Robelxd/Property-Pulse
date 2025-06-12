
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { User } from 'lucide-react'

interface Profile {
  id: string
  email: string
  full_name: string
  phone: string
  user_type: string
  avatar_url: string
}

const UserProfile = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<Profile>()

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setProfile(data)
        setValue('full_name', data.full_name || '')
        setValue('phone', data.phone || '')
        setValue('user_type', data.user_type || 'buyer')
        setValue('email', data.email || user?.email || '')
      } else {
        // Create initial profile if it doesn't exist
        const newProfile = {
          id: user!.id,
          email: user!.email || '',
          full_name: '',
          phone: '',
          user_type: 'buyer',
          avatar_url: ''
        }
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile])
        
        if (insertError) {
          console.error('Error creating profile:', insertError)
        } else {
          setProfile(newProfile)
          setValue('full_name', '')
          setValue('phone', '')
          setValue('user_type', 'buyer')
          setValue('email', user!.email || '')
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error loading profile',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const onSubmit = async (data: Profile) => {
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: data.email,
          full_name: data.full_name,
          phone: data.phone,
          user_type: data.user_type,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      setProfile({ ...profile!, ...data })
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.'
      })
    } catch (error: any) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader className="text-center">
          <Avatar className="h-24 w-24 mx-auto mb-4">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="text-lg">
              {profile?.full_name ? getInitials(profile.full_name) : <User className="h-8 w-8" />}
            </AvatarFallback>
          </Avatar>
          <CardTitle>{profile?.full_name || 'Complete your profile'}</CardTitle>
          <CardDescription>{profile?.email}</CardDescription>
        </CardHeader>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  {...register('full_name', { required: 'Full name is required' })}
                  placeholder="Enter your full name"
                />
                {errors.full_name && (
                  <p className="text-sm text-red-600">{String(errors.full_name.message)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user_type">User Type</Label>
                <Select onValueChange={(value) => setValue('user_type', value)} defaultValue={watch('user_type')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserProfile

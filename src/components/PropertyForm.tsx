import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import ImageUpload from './ImageUpload'

interface PropertyFormProps {
  property?: any
  onSave: () => void
  onCancel: () => void
}

const PropertyForm = ({ property, onSave, onCancel }: PropertyFormProps) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: property || {
      title: '',
      description: '',
      price: '',
      property_type: '',
      bedrooms: 0,
      bathrooms: 0,
      square_feet: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      status: 'active'
    }
  })

  useEffect(() => {
    if (property) {
      Object.keys(property).forEach(key => {
        setValue(key, property[key])
      })
      // Load existing images
      loadPropertyImages(property.id)
    }
  }, [property, setValue])

  const loadPropertyImages = async (propertyId: string) => {
    const { data, error } = await supabase
      .from('property_images')
      .select('image_url')
      .eq('property_id', propertyId)
      .order('created_at')

    if (!error && data) {
      setImages(data.map(img => img.image_url))
    }
  }

  const onSubmit = async (data: any) => {
    if (!user) return

    setLoading(true)
    try {
      const propertyData = {
        ...data,
        user_id: user.id,
        price: parseFloat(data.price),
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseFloat(data.bathrooms),
        square_feet: data.square_feet ? parseInt(data.square_feet) : null
      }

      let propertyId = property?.id

      if (property) {
        // Update existing property
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', property.id)

        if (error) throw error
      } else {
        // Create new property
        const { data: newProperty, error } = await supabase
          .from('properties')
          .insert(propertyData)
          .select()
          .single()

        if (error) throw error
        propertyId = newProperty.id
      }

      // Handle image uploads
      if (images.length > 0 && propertyId) {
        await savePropertyImages(propertyId, images)
      }

      toast({
        title: property ? 'Property updated' : 'Property created',
        description: property ? 'Your property has been updated successfully.' : 'Your property has been created successfully.'
      })

      onSave()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const savePropertyImages = async (propertyId: string, imageUrls: string[]) => {
    // Delete existing images if updating
    if (property) {
      await supabase
        .from('property_images')
        .delete()
        .eq('property_id', propertyId)
    }

    // Insert new images
    const imageData = imageUrls.map((url, index) => ({
      property_id: propertyId,
      image_url: url,
      is_primary: index === 0
    }))

    const { error } = await supabase
      .from('property_images')
      .insert(imageData)

    if (error) throw error
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{property ? 'Edit Property' : 'Add New Property'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                {...register('title', { required: 'Title is required' })}
                placeholder="Beautiful Family Home"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{String(errors.title.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="property_type">Property Type</Label>
              <Select onValueChange={(value) => setValue('property_type', value)} defaultValue={watch('property_type')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                {...register('price', { required: 'Price is required' })}
                placeholder="850000"
              />
              {errors.price && (
                <p className="text-sm text-red-600">{String(errors.price.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="square_feet">Square Feet</Label>
              <Input
                id="square_feet"
                type="number"
                {...register('square_feet')}
                placeholder="2500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                {...register('bedrooms', { required: 'Bedrooms is required' })}
                placeholder="3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                step="0.5"
                {...register('bathrooms', { required: 'Bathrooms is required' })}
                placeholder="2.5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe your property..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...register('address', { required: 'Address is required' })}
                placeholder="123 Main St"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register('city', { required: 'City is required' })}
                placeholder="San Francisco"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                {...register('state', { required: 'State is required' })}
                placeholder="CA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip_code">Zip Code</Label>
              <Input
                id="zip_code"
                {...register('zip_code', { required: 'Zip code is required' })}
                placeholder="94105"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Property Images</Label>
            <ImageUpload images={images} onImagesChange={setImages} />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Saving...' : (property ? 'Update Property' : 'Create Property')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default PropertyForm

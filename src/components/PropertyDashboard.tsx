
import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PropertyForm from './PropertyForm'
import PropertyList from './PropertyList'

const PropertyDashboard = () => {
  const [activeTab, setActiveTab] = useState('list')
  const [editingProperty, setEditingProperty] = useState(null)

  const handleAddProperty = () => {
    setEditingProperty(null)
    setActiveTab('form')
  }

  const handleEditProperty = (property: any) => {
    setEditingProperty(property)
    setActiveTab('form')
  }

  const handlePropertySaved = () => {
    setActiveTab('list')
    setEditingProperty(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Property Management</h1>
        <Button onClick={handleAddProperty} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">My Properties</TabsTrigger>
          <TabsTrigger value="form">
            {editingProperty ? 'Edit Property' : 'Add Property'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-6">
          <PropertyList onEditProperty={handleEditProperty} />
        </TabsContent>
        
        <TabsContent value="form" className="mt-6">
          <PropertyForm 
            property={editingProperty} 
            onSave={handlePropertySaved}
            onCancel={() => setActiveTab('list')}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PropertyDashboard

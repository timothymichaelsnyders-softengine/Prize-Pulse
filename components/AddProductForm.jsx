"use client";

import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { addProduct } from '@/app/actions';
import { toast } from 'sonner';

const AddProductForm = ({ user }) => {

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);

    // start building formData
    const formData = new FormData();
    formData.append("url", url);

    // add the product using the server action
    const result = await addProduct(formData);

    if(result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message || "Product tracked successfully!");
      setUrl("");
    }

    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='w-full max-w-2xl mx-auto'>
        <div className='flex flex-col sm:flex-row gap-2'>
          <Input 
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste product URL (Amazon, Takealot, etc...)"
            className={"h-12 text=base"}
            // className={"h-12 max-w-2xl text=base"}
            required
            disabled={loading}
            />

          <Button 
            className={"bg-orange-500 hover:bg-orange-600 h-10 sm:h-12 px-8"}
            type="submit"
            disabled={loading}
            size={"lg"}
            >
            {loading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Adding...
              </>
            ) : (
              "Track Price"
            )}
          </Button>
        </div>
      </form>

      {/* Authentication Modal */}
      {/* If the user is not logged in and they try to add a product, then ask them to log in first */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      
    </>
  )
}

export default AddProductForm
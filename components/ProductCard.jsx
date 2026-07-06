"use client";

import { deleteProduct } from '@/app/actions';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { ChevronDown, ChevronUp, ExternalLink, Image, Trash2, TrendingDown } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import Link from 'next/link';
import PriceChart from './PriceChart';

const ProductCard = ({ product }) => {

  const [showChart, setShowChart] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if(!confirm("Remove this product from tracking?")) return;

    setDeleting(true);
    const result = await deleteProduct(product.id);

    // Similar to insertion
    if(result.error) {
          toast.error(result.error);
        } else {
          toast.success(result.message || "Product deleted successfully!");
        //   setUrl("");
        }
    
        setDeleting(false);
  }

  return (
    <Card className={"hover:shadow-lg transition-shadow"}>
        <CardHeader className={"pb-3"}>
            <div className='flex gap-4'>
                {/* Product Image */}
                {product.image_url && (
                    // <Image : we can use lucid-react Image tag
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                        src={product.image_url}
                        alt={product.name}
                        className='w-20 h-20 object-cover rounded-md border'
                    />
                )}

                <div className='flex-1 min-w-0'>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                        {product.name}
                    </h3>

                    <div className='flex items-baseline gap-2'>
                        <span className='text-3xl font-bold text-orange-500'>
                            {product.currency} {product.current_price}
                        </span>

                        <Badge variant='secondary' className={"gap-1"}>
                            <TrendingDown className='w-3 h-3' />
                            Tracking
                        </Badge>
                    </div>
                </div>
            </div>
        </CardHeader>

        <CardContent>
            <div className='flex flex-wrap gap-2'>
                {/* Btn to show/hide the chart */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowChart(!showChart)}
                    className="gap-1"
                >
                    {showChart ? (
                        <>
                            <ChevronUp className='w-4 h-4' />
                            Hide Chart
                        </>
                    ) : (
                        <>
                            <ChevronDown className='w-4 h-4' />
                            Show Chart
                        </>
                    )}
                </Button>

                {/* View product Btn */}
                <Button variant="outline" size="sm" asChild className="gap-1">
                    <Link href={product.url} target="_blank" rel="noopener noreferrer" className='flex items-center gap-1'>
                        <ExternalLink className='w-4 h-4' />
                        View Product
                    </Link>
                </Button>

                {/* Button for Deleting the Product */}
                <Button variant="ghost" size="sm" onClick={handleDelete} disabled={deleting} className={"bg-red-200 text-red-600 hover:text-white hover:bg-red-400 gap-1"}>
                    <Trash2 className='w-4 h-4' />
                    Remove
                </Button>
            </div>
        </CardContent>
        {showChart && ( 
            <CardFooter className={"pt-0"}>
                {/* PriceChart component */}
                <PriceChart productId={product.id} />
            </CardFooter>
        )}
    </Card>
  )
}

export default ProductCard
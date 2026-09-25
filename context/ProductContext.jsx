import { createContext, useContext, useState, useEffect } from 'react';
import { products as staticProducts } from '../data/products';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [adminProducts, setAdminProducts] = useState([]);
  const [staticOverrides, setStaticOverrides] = useState({});
  const [deletedIds, setDeletedIds] = useState([]);

  // Load static overrides from local storage
  useEffect(() => {
    try {
      setStaticOverrides(JSON.parse(localStorage.getItem('trt-static-overrides') || '{}'));
      setDeletedIds(JSON.parse(localStorage.getItem('trt-deleted-ids') || '[]'));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Fetch admin products from Supabase
  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products from database');
    } else {
      setAdminProducts(data || []);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Save static overrides to local storage
  useEffect(() => {
    localStorage.setItem('trt-static-overrides', JSON.stringify(staticOverrides));
    localStorage.setItem('trt-deleted-ids', JSON.stringify(deletedIds));
  }, [staticOverrides, deletedIds]);

  const allProducts = adminProducts.map(product => ({
    ...product,
    tags: Array.isArray(product.tags) ? product.tags : typeof product.tags === 'string' ? product.tags.split(',') : [],
    images: Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image ? [product.image] : [],
  }));

  const addProduct = async (data) => {
    const { error } = await supabase.from('products').insert([data]);
    if (error) {
      console.error(error);
      toast.error('Failed to add product');
    } else {
      fetchProducts();
      toast.success('Product added successfully!');
    }
  };

  const updateProduct = async (data) => {
    const isStatic = staticProducts.some(p => p.id === data.id);
    if (isStatic) {
      setStaticOverrides(prev => ({ ...prev, [data.id]: data }));
      toast.success('Product updated!');
      return;
    }
    
    // Update in Supabase
    const { error } = await supabase.from('products').update(data).eq('id', data.id);
    if (error) {
      console.error(error);
      toast.error('Failed to update product');
    } else {
      fetchProducts();
      toast.success('Product updated successfully!');
    }
  };

  const deleteProduct = async (id) => {
    const isStatic = staticProducts.some(p => p.id === id);
    if (isStatic) {
      setDeletedIds(prev => [...prev, id]);
      toast.success('Product deleted!');
      return;
    }
    
    // Find the product first to get its image URL
    const productToDelete = adminProducts.find(p => p.id === id);

    // Delete from Supabase Database
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error(error);
      toast.error('Failed to delete product');
    } else {
      // If DB delete is successful, also delete the image from storage to free space
      if (productToDelete && productToDelete.image && productToDelete.image.includes('supabase.co')) {
        try {
          const parts = productToDelete.image.split('/');
          const oldFileName = parts[parts.length - 1];
          if (oldFileName) {
            await supabase.storage.from('product-images').remove([oldFileName]);
          }
        } catch (delErr) {
          console.error('Failed to delete associated image:', delErr);
        }
      }

      fetchProducts();
      toast.success('Product deleted successfully!');
    }
  };

  return (
    <ProductContext.Provider value={{ allProducts, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
};

import { createContext, useContext, useReducer, useEffect } from 'react';
import { products as staticProducts } from '../data/products';

const ProductContext = createContext();

const loadState = () => {
  try {
    return {
      adminProducts: JSON.parse(localStorage.getItem('trt-admin-products') || '[]'),
      staticOverrides: JSON.parse(localStorage.getItem('trt-static-overrides') || '{}'),
      deletedIds: JSON.parse(localStorage.getItem('trt-deleted-ids') || '[]'),
    };
  } catch {
    return { adminProducts: [], staticOverrides: {}, deletedIds: [] };
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return { ...state, adminProducts: [...state.adminProducts, action.payload] };
    case 'UPDATE': {
      const isStatic = staticProducts.some(p => p.id === action.payload.id);
      if (isStatic) {
        return { ...state, staticOverrides: { ...state.staticOverrides, [action.payload.id]: action.payload } };
      }
      return { ...state, adminProducts: state.adminProducts.map(p => p.id === action.payload.id ? action.payload : p) };
    }
    case 'DELETE':
      return {
        ...state,
        adminProducts: state.adminProducts.filter(p => p.id !== action.payload),
        deletedIds: [...state.deletedIds, action.payload],
      };
    default:
      return state;
  }
};

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    localStorage.setItem('trt-admin-products', JSON.stringify(state.adminProducts));
    localStorage.setItem('trt-static-overrides', JSON.stringify(state.staticOverrides));
    localStorage.setItem('trt-deleted-ids', JSON.stringify(state.deletedIds));
  }, [state]);

  const allProducts = [
    ...staticProducts
      .filter(p => !state.deletedIds.includes(p.id))
      .map(p => state.staticOverrides[p.id] || p),
    ...state.adminProducts.filter(p => !state.deletedIds.includes(p.id)),
  ].map(product => ({
    ...product,
    tags: Array.isArray(product.tags) ? product.tags : [],
    images: Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image ? [product.image] : [],
  }));

  const addProduct = (data) =>
    dispatch({ type: 'ADD', payload: { ...data, id: Date.now(), images: data.image ? [data.image] : [] } });

  const updateProduct = (data) => dispatch({ type: 'UPDATE', payload: data });
  const deleteProduct = (id) => dispatch({ type: 'DELETE', payload: id });

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

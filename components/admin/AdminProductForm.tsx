import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRightIcon, UploadIcon, TrashIcon, StarIcon, XIcon, BoldIcon, ItalicIcon, UnderlineIcon, LinkIcon } from '../icons/Icons';
import type { Product, ProductFormData } from '../../types';

interface Props {
    productId: number | null;
    onSave: () => void;
    onCancel: () => void;
}

const emptyFormData: ProductFormData = {
    name: '',
    sku: '',
    image: 'https://placehold.co/400x400/f59e0b/white?text=Tool',
    gallery: [],
    stock: 0,
    prices: { retail: 0, wholesale: 0 },
    category: '',
    description: '',
};

const AdminProductForm: React.FC<Props> = ({ productId, onSave, onCancel }) => {
    const { getProductById, addProduct, updateProduct } = useApp();
    const [formData, setFormData] = useState<ProductFormData>(emptyFormData);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (productId) {
            const product = getProductById(productId);
            if (product) {
                setFormData(product);
            }
        } else {
            setFormData(emptyFormData);
        }
    }, [productId, getProductById]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'retail' || name === 'wholesale') {
            setFormData(prev => ({ ...prev, prices: { ...prev.prices, [name]: Number(value) }}));
        } else {
            setFormData(prev => ({ ...prev, [name]: name === 'stock' ? Number(value) : value }));
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        files.forEach((file: File) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setFormData(prev => {
                        const newGallery = [...prev.gallery, reader.result as string];
                        const newMainImage = prev.gallery.length === 0 ? reader.result as string : prev.image;
                        return { ...prev, gallery: newGallery, image: newMainImage };
                    });
                }
            };
            reader.readAsDataURL(file);
        });
        e.target.value = ''; // Reset file input
    };

    const setAsMainImage = (url: string) => {
        setFormData(prev => ({ ...prev, image: url }));
    };

    const deleteImage = (urlToDelete: string) => {
        setFormData(prev => {
            const newGallery = prev.gallery.filter(url => url !== urlToDelete);
            const newMainImage = prev.image === urlToDelete 
                ? (newGallery[0] || 'https://placehold.co/400x400/f59e0b/white?text=Tool') 
                : prev.image;
            return { ...prev, gallery: newGallery, image: newMainImage };
        });
    };

    const handleDescriptionChange = (e: React.FormEvent<HTMLDivElement>) => {
        setFormData(prev => ({ ...prev, description: e.currentTarget.innerHTML }));
    };

    const execCmd = (command: string, value?: string) => {
        if (editorRef.current) {
            editorRef.current.focus();
            document.execCommand(command, false, value);
            // After executing the command, dispatch an input event to sync React state
            // This ensures a single, reliable way of updating the description state
            const event = new Event('input', { bubbles: true });
            editorRef.current.dispatchEvent(event);
        }
    };

    const handleLink = () => {
        const url = prompt('آدرس لینک را وارد کنید:', 'https://');
        if (url) {
            execCmd('createLink', url);
        }
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (productId) {
            updateProduct({ ...formData, id: productId });
        } else {
            addProduct(formData);
        }
        onSave();
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <button onClick={onCancel} className="flex items-center gap-2 text-sm p-4 text-gray-600 dark:text-gray-400 hover:text-yellow-600">
                <ChevronRightIcon className="w-5 h-5" />
                <span>بازگشت به لیست محصولات</span>
            </button>
            <form onSubmit={handleSubmit} className="p-6 pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Image Gallery */}
                    <div className="lg:col-span-1 space-y-4">
                        <h3 className="font-bold text-lg">گالری تصاویر</h3>
                        <div className="grid grid-cols-3 gap-2">
                           {formData.gallery.map((url, index) => (
                               <div key={index} className="relative group aspect-square">
                                   <img src={url} alt={`Product image ${index+1}`} className="w-full h-full object-cover rounded-md"/>
                                   <div className={`absolute inset-0 rounded-md ring-2 transition-all ${formData.image === url ? 'ring-yellow-500' : 'ring-transparent'}`}></div>
                                   <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center gap-2 transition-all">
                                       <button type="button" onClick={() => setAsMainImage(url)} title="انتخاب به عنوان اصلی" className="p-1.5 bg-white/80 rounded-full text-yellow-500 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity">
                                           <StarIcon className="w-5 h-5" />
                                       </button>
                                       <button type="button" onClick={() => deleteImage(url)} title="حذف تصویر" className="p-1.5 bg-white/80 rounded-full text-red-500 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity">
                                           <TrashIcon className="w-5 h-5" />
                                       </button>
                                   </div>
                                    {formData.image === url && <StarIcon className="w-5 h-5 absolute top-1 right-1 text-yellow-400 drop-shadow-lg" />}
                               </div>
                           ))}
                           <button 
                             type="button" 
                             onClick={() => fileInputRef.current?.click()}
                             className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md flex flex-col items-center justify-center text-gray-400 hover:border-yellow-500 hover:text-yellow-500 transition-colors aspect-square">
                               <UploadIcon className="w-8 h-8"/>
                               <span className="text-xs mt-1">آپلود</span>
                           </button>
                           <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        </div>
                    </div>
                    {/* Product Details */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="form-label">نام محصول</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="sku" className="form-label">شناسه کالا (SKU)</label>
                            <input type="text" name="sku" id="sku" value={formData.sku} onChange={handleChange} required className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="category" className="form-label">دسته بندی</label>
                            <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} required className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="retail" className="form-label">قیمت تکی (تومان)</label>
                            <input type="number" name="retail" id="retail" value={formData.prices.retail} onChange={handleChange} required className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="wholesale" className="form-label">قیمت همکار (تومان)</label>
                            <input type="number" name="wholesale" id="wholesale" value={formData.prices.wholesale} onChange={handleChange} required className="form-input" />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="stock" className="form-label">موجودی انبار</label>
                            <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} required className="form-input" />
                        </div>
                         <div className="md:col-span-2">
                            <label htmlFor="description" className="form-label">توضیحات</label>
                             <div className="border border-gray-300 dark:border-gray-600 rounded-md">
                                <div className="flex items-center gap-1 p-2 border-b dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 rounded-t-md flex-wrap">
                                    <button type="button" title="Bold" onClick={() => execCmd('bold')} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"><BoldIcon className="w-5 h-5" /></button>
                                    <button type="button" title="Italic" onClick={() => execCmd('italic')} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"><ItalicIcon className="w-5 h-5" /></button>
                                    <button type="button" title="Underline" onClick={() => execCmd('underline')} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"><UnderlineIcon className="w-5 h-5" /></button>
                                    <button type="button" title="Link" onClick={handleLink} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"><LinkIcon className="w-5 h-5" /></button>
                                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-1"></div>
                                    <button type="button" title="Heading 2" onClick={() => execCmd('formatBlock', '<h2>')} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-bold">H2</button>
                                    <button type="button" title="Heading 3" onClick={() => execCmd('formatBlock', '<h3>')} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-bold">H3</button>
                                </div>
                                <div
                                    id="descriptionEditor"
                                    ref={editorRef}
                                    onInput={handleDescriptionChange}
                                    contentEditable
                                    dangerouslySetInnerHTML={{ __html: formData.description }}
                                    className="form-input min-h-[120px] rounded-t-none border-0 focus:ring-0 prose dark:prose-invert max-w-none"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-6 border-t dark:border-gray-700 mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onCancel} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
                        انصراف
                    </button>
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-bold">
                        ذخیره محصول
                    </button>
                </div>
            </form>
             <style jsx>{`
                .form-label {
                     display: block;
                     font-size: 0.875rem; /* text-sm */
                     font-weight: 500; /* font-medium */
                     margin-bottom: 0.25rem; /* mb-1 */
                }
                .form-input {
                    width: 100%;
                    padding: 0.5rem 0.75rem;
                    border: 1px solid #d1d5db; /* gray-300 */
                    border-radius: 0.375rem; /* rounded-md */
                    background-color: #f9fafb; /* gray-50 */
                }
                .dark .form-input {
                    background-color: #374151; /* gray-700 */
                    border-color: #4b5563; /* gray-600 */
                    color: #f3f4f6; /* gray-100 */
                }
                .form-input:focus {
                    outline: 2px solid transparent;
                    outline-offset: 2px;
                    border-color: #f59e0b; /* yellow-500 */
                    box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.5);
                }
            `}</style>
        </div>
    );
};

export default AdminProductForm;
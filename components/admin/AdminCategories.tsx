import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import type { Category } from '../../types';
import { PencilIcon, TrashIcon } from '../icons/Icons';

const AdminCategories: React.FC = () => {
    const { categories, addCategory, updateCategory, deleteCategory } = useApp();
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', slug: '', parentId: '' });

    const categoriesHierarchy = useMemo(() => {
        const buildHierarchy = (parentId: number | null, depth = 0): (Category & { depth: number })[] => {
            const children = categories.filter(c => c.parentId === parentId);
            let result: (Category & { depth: number })[] = [];
            for (const child of children) {
                result.push({ ...child, depth });
                result = result.concat(buildHierarchy(child.id, depth + 1));
            }
            return result;
        };
        return buildHierarchy(null);
    }, [categories]);
    
    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, slug: category.slug, parentId: String(category.parentId || '') });
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
        setFormData({ name: '', slug: '', parentId: '' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const categoryData = {
            name: formData.name,
            slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
            parentId: formData.parentId ? Number(formData.parentId) : null,
        };
        
        if (editingCategory) {
            updateCategory({ ...editingCategory, ...categoryData });
        } else {
            addCategory(categoryData);
        }
        handleCancelEdit();
    };
    
    const handleDelete = (categoryId: number) => {
        if(window.confirm('آیا مطمئن هستید؟ حذف یک دسته، تمام زیردسته‌های آن را نیز حذف می‌کند.')) {
            deleteCategory(categoryId);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold mb-4">{editingCategory ? 'ویرایش دسته' : 'افزودن دسته جدید'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="form-label">نام</label>
                            <input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label htmlFor="slug" className="form-label">اسلاگ (نامک)</label>
                            <input
                                id="slug"
                                type="text"
                                value={formData.slug}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                className="form-input"
                                placeholder="اختیاری - خودکار ساخته می‌شود"
                            />
                        </div>
                        <div>
                            <label htmlFor="parentId" className="form-label">دسته مادر</label>
                            <select
                                id="parentId"
                                value={formData.parentId}
                                onChange={e => setFormData({ ...formData, parentId: e.target.value })}
                                className="form-input"
                            >
                                <option value="">— هیچکدام —</option>
                                {categoriesHierarchy.map(cat => (
                                    <option key={cat.id} value={cat.id} disabled={editingCategory?.id === cat.id}>
                                        {'—'.repeat(cat.depth)} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2 pt-2">
                             <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                                {editingCategory ? 'بروزرسانی' : 'افزودن دسته'}
                            </button>
                            {editingCategory && (
                                <button type="button" onClick={handleCancelEdit} className="bg-gray-200 dark:bg-gray-600 px-4 py-2 rounded-md">
                                    لغو
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
            <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                     <h2 className="text-2xl font-bold mb-4">لیست دسته‌بندی‌ها</h2>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                                <tr>
                                    <th className="p-3 text-right">نام</th>
                                    <th className="p-3 text-right">اسلاگ</th>
                                    <th className="p-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoriesHierarchy.map(cat => (
                                    <tr key={cat.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="p-3">
                                            <span style={{ paddingRight: `${cat.depth * 20}px` }}>
                                                {cat.name}
                                            </span>
                                        </td>
                                        <td className="p-3 font-mono text-gray-500">{cat.slug}</td>
                                        <td className="p-3 text-left">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(cat)} className="text-blue-500 hover:text-blue-700 p-1"><PencilIcon className="w-5 h-5"/></button>
                                                <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>
            </div>
            <style jsx>{`
                .form-label {
                     display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem;
                }
                .form-input {
                    width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background-color: #f9fafb;
                }
                .dark .form-input {
                    background-color: #374151; border-color: #4b5563; color: #f3f4f6;
                }
                .form-input:focus {
                    outline: 2px solid transparent; outline-offset: 2px; border-color: #f59e0b; box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.5);
                }
            `}</style>
        </div>
    );
};

export default AdminCategories;

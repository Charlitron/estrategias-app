
import React, { useState, useEffect, useRef } from 'react';
import { KnowledgeItem, KnowledgeType, KnowledgeVertical } from '../../types';
import { Pencil, Trash, Upload, Download, Refresh, ShieldCheck } from '../icons';
import { getKnowledge, addKnowledge, updateKnowledge, deleteKnowledge, addMultipleKnowledge } from '../../services/database';
import ConfirmationModal from './ConfirmationModal';

interface AdminTrainingPageProps {
    onCountChange: (count: number) => void;
}

const KNOWLEDGE_TYPES: { value: KnowledgeType; label: string; icon: string }[] = [
    { value: 'general', label: 'Conocimiento General', icon: '📝' },
    { value: 'methodology', label: 'Metodología', icon: '📊' },
    { value: 'principle', label: 'Principio de Venta', icon: '💡' },
    { value: 'case_study', label: 'Caso de Éxito', icon: '🏆' },
    { value: 'blocking_rule', label: '⛔ Regla de Bloqueo', icon: '🛑' },
    { value: 'threshold', label: 'Umbral de Crecimiento', icon: '📈' },
];

const VERTICALS: { value: KnowledgeVertical; label: string }[] = [
    { value: 'general', label: 'General / Universal' },
    { value: 'restaurantes', label: 'Restaurantes y Alimentos' },
    { value: 'servicios', label: 'Servicios Profesionales' },
    { value: 'retail', label: 'Retail / Tiendas' },
    { value: 'medico', label: 'Salud y Médico' },
    { value: 'inmobiliaria', label: 'Inmobiliaria' },
];

const AdminTrainingPage: React.FC<AdminTrainingPageProps> = ({ onCountChange }) => {
    const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
    
    // Form States
    const [content, setContent] = useState('');
    const [type, setType] = useState<KnowledgeType>('general');
    const [vertical, setVertical] = useState<KnowledgeVertical>('general');
    const [weight, setWeight] = useState<number>(50);
    const [isHardRule, setIsHardRule] = useState(false);
    const [tagsInput, setTagsInput] = useState('');

    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const knowledgeListRef = useRef<HTMLDivElement>(null);
    const importFileRef = useRef<HTMLInputElement>(null);

    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);

    // Función robusta para cargar datos con reintentos
    const fetchKnowledge = async (retries = 3) => {
        try {
            // Fix: correctly destructure result from getKnowledge to access items array
            const result = await getKnowledge();
            if (result && result.items) {
                setKnowledgeItems(result.items);
                onCountChange(result.items.length);
            }
        } catch (error) {
            if (retries > 0) {
                console.warn(`Falló la carga, reintentando... quedan ${retries} intentos.`);
                setTimeout(() => fetchKnowledge(retries - 1), 2000); // Esperar 2s y reintentar
            } else {
                console.error("Fallaron todos los reintentos de carga.");
                throw error;
            }
        }
    };

    useEffect(() => {
        const loadInitial = async () => {
            setLoading(true);
            try {
                await fetchKnowledge();
            } catch(e) {
                showNotification('Error de conexión. Revisa si tienes un AdBlocker activado.', 'error');
            } finally {
                setLoading(false);
            }
        };
        loadInitial();
    }, []);

    const showNotification = (message: string, notifType: 'success' | 'error' = 'success') => {
        setNotification({ type: notifType, message });
        setTimeout(() => setNotification(null), 5000); 
    };

    const resetForm = () => {
        setContent('');
        setType('general');
        setVertical('general');
        setWeight(50);
        setIsHardRule(false);
        setTagsInput('');
        setEditingItemId(null);
    };
    
    const handleSave = async () => {
        if (!content.trim()) {
            showNotification("⚠️ El contenido no puede estar vacío", 'error');
            return;
        }

        setIsSaving(true);

        // Preparamos los datos automáticos basados en la selección
        const selectedTypeObj = KNOWLEDGE_TYPES.find(t => t.value === type);
        const categoryLabel = selectedTypeObj?.label || 'General';
        const iconChar = selectedTypeObj?.icon || '📝';
        const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(t => t !== '');

        // Timeout AUMENTADO a 60 segundos (antes 10s) para conexiones lentas
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("La operación tardó demasiado (Timeout 60s). Verifica tu internet.")), 60000)
        );

        try {
            const saveOperation = async () => {
                if (editingItemId) {
                    const updatedItem = await updateKnowledge(
                        editingItemId, 
                        content, 
                        categoryLabel,
                        iconChar,
                        type,
                        vertical,
                        weight,
                        isHardRule,
                        tagsArray
                    );
                    setKnowledgeItems(prevItems => prevItems.map(item => item.id === editingItemId ? updatedItem : item));
                    showNotification("✅ Regla actualizada exitosamente");
                } else {
                    const newItem = await addKnowledge(
                        content, 
                        categoryLabel,
                        iconChar,
                        type,
                        vertical,
                        weight,
                        isHardRule,
                        tagsArray
                    );
                    setKnowledgeItems(prevItems => [newItem, ...prevItems]);
                    showNotification("✅ Nueva regla guardada exitosamente");
                }
                resetForm();
                return true;
            };

            // Carrera entre la operación y el timeout
            await Promise.race([saveOperation(), timeoutPromise]);

        } catch (error: any) {
            console.error("Error capturado en UI:", error);
            
            let errorMsg = error.message || "Error al guardar.";
            
            // Detección de errores comunes de Supabase
            if (error.code === '42501') {
                errorMsg = "⛔ ERROR DE PERMISOS: No tienes permiso para editar esto.";
            } else if (error.code === '42703') {
                 errorMsg = `🚨 Error de Columnas: ${error.message}.`;
            } else if (error.message && (error.message.includes('fetch') || error.message.includes('network'))) {
                 errorMsg = "🌐 Error de red: Verifica tu conexión a internet.";
            }

            showNotification(errorMsg, 'error');
        } finally {
            setIsSaving(false);
        }
    };
    
    // Use useEffect to update the parent count whenever knowledgeItems changes
    useEffect(() => {
        onCountChange(knowledgeItems.length);
    }, [knowledgeItems, onCountChange]);

    const handleEdit = (item: KnowledgeItem) => {
        setContent(item.content);
        setType(item.type || 'general');
        setVertical(item.vertical || 'general');
        setWeight(item.weight || 50);
        setIsHardRule(item.is_hard_rule || false);
        setTagsInput(item.tags ? item.tags.join(', ') : '');
        setEditingItemId(item.id);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = (itemId: string) => {
        setItemToDeleteId(itemId);
        setIsConfirmDeleteOpen(true);
    };

    const executeDelete = async () => {
        if (!itemToDeleteId) return;
        const success = await deleteKnowledge(itemToDeleteId);
        if (success) {
            setKnowledgeItems(prevItems => prevItems.filter(item => item.id !== itemToDeleteId));
            showNotification("Elemento eliminado.");
        } else {
            showNotification("❌ Error al eliminar el elemento", 'error');
        }
        setIsConfirmDeleteOpen(false);
        setItemToDeleteId(null);
    };
    
    const handleExport = () => {
        const textToSave = knowledgeItems.map(item => 
            `TYPE: ${item.type}\nVERTICAL: ${item.vertical}\nWEIGHT: ${item.weight}\nHARD_RULE: ${item.is_hard_rule}\nCONTENT:\n${item.content}`
        ).join('\n\n---\n\n');
        
        const blob = new Blob([textToSave], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `charlitron-db-${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification("Conocimiento exportado.");
    };
    
    const handleImportClick = () => {
        importFileRef.current?.click();
    };

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = e.target?.result as string;
            const entries = content.split(/\n\n---\n\n/);
            const newItemsData = entries.filter(entry => entry.trim()).map(entry => {
                let cleanContent = entry;
                if(entry.includes('CONTENT:')) {
                     cleanContent = entry.split('CONTENT:\n')[1] || entry;
                }
                // Mapeo básico para importación
                return { 
                    content: cleanContent, 
                    type: 'general', 
                    vertical: 'general', 
                    weight: 50,
                    category: 'General',
                    icon: '📝'
                };
            });
            
            const addedItems = await addMultipleKnowledge(newItemsData);
            if (addedItems && addedItems.length > 0) {
                 setKnowledgeItems(prevItems => [...prevItems, ...addedItems]);
                 showNotification(`✅ ${addedItems.length} elementos importados.`);
            } else {
                showNotification("❌ Error al importar.", 'error');
            }
        };
        reader.readAsText(file);
        if (importFileRef.current) importFileRef.current.value = "";
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await fetchKnowledge();
        } catch (error) {
            showNotification("Error al recargar.", 'error');
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in border-t-4 border-amber-400">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Entrenador Estratégico</h2>
                        <p className="text-gray-500 text-sm">Define las reglas del cerebro de Charlitron.</p>
                    </div>
                    {editingItemId && (
                        <button onClick={resetForm} className="text-sm text-red-600 hover:text-red-800 underline">
                            Cancelar Edición
                        </button>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    {/* Columna Izquierda: Clasificación */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Conocimiento</label>
                            <select 
                                value={type} 
                                onChange={(e) => setType(e.target.value as KnowledgeType)}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-amber-500 focus:border-amber-500 bg-white"
                            >
                                {KNOWLEDGE_TYPES.map(t => (
                                    <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vertical / Industria</label>
                            <select 
                                value={vertical} 
                                onChange={(e) => setVertical(e.target.value as KnowledgeVertical)}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-amber-500 focus:border-amber-500 bg-white"
                            >
                                {VERTICALS.map(v => (
                                    <option key={v.value} value={v.value}>{v.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-grow">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Peso / Prioridad ({weight})
                                </label>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="100" 
                                    value={weight} 
                                    onChange={(e) => setWeight(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                />
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Bajo</span>
                                    <span>Crítico</span>
                                </div>
                            </div>
                            <div className="flex items-center pt-4">
                                <label className="flex items-center cursor-pointer relative">
                                    <input 
                                        type="checkbox" 
                                        checked={isHardRule}
                                        onChange={(e) => setIsHardRule(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-700">Regla Dura</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Contenido */}
                    <div className="flex flex-col h-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contenido / Regla / Prompt</label>
                        <textarea 
                            rows={8}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-amber-500 focus:border-amber-500 font-mono text-sm flex-grow"
                            placeholder="Escribe aquí el conocimiento..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                         <div className="mt-2">
                             <input 
                                type="text"
                                placeholder="Etiquetas (separadas por coma): b2b, premium, norte..."
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                className="w-full border border-gray-300 rounded-md py-1 px-3 text-sm"
                             />
                         </div>
                    </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className={`font-bold py-2 px-8 rounded-lg transition-colors shadow-md text-white flex items-center gap-2 ${
                            editingItemId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
                        } ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {isSaving && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {isSaving 
                            ? (editingItemId ? 'Actualizando...' : 'Guardando...') 
                            : (editingItemId ? 'Actualizar Regla' : 'Guardar Nueva Regla')
                        }
                    </button>
                </div>
            </div>

            <div ref={knowledgeListRef} className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                        📚 Base de Conocimiento ({knowledgeItems.length})
                    </h3>
                     <div className="flex gap-2">
                        <button onClick={handleImportClick} className="p-2 text-gray-600 hover:bg-gray-200 rounded-md text-xs flex items-center gap-1 border border-gray-300">
                            <Upload className="w-4 h-4"/> Importar
                        </button>
                        <input type="file" ref={importFileRef} onChange={handleFileImport} accept=".txt" className="hidden" />
                        <button onClick={handleExport} className="p-2 text-gray-600 hover:bg-gray-200 rounded-md text-xs flex items-center gap-1 border border-gray-300">
                            <Download className="w-4 h-4"/> Exportar
                        </button>
                        <button onClick={handleRefresh} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full">
                            <Refresh className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    {knowledgeItems.map(item => (
                        <div key={item.id} className={`bg-white p-4 rounded-lg shadow-sm border-l-4 flex gap-4 ${item.is_hard_rule ? 'border-l-red-500 bg-red-50' : 'border-l-blue-400'}`}>
                            <div className="text-2xl pt-1">
                                {item.icon || '📝'}
                            </div>
                            <div className="flex-grow">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">{item.type}</span>
                                    {item.vertical !== 'general' && (
                                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-semibold">{item.vertical}</span>
                                    )}
                                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">Peso: {item.weight}</span>
                                    {item.is_hard_rule && (
                                         <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> HARD RULE</span>
                                    )}
                                </div>
                                <p className="text-gray-800 text-sm whitespace-pre-wrap">{item.content}</p>
                                {item.tags && item.tags.length > 0 && (
                                    <div className="mt-2 flex gap-1 flex-wrap">
                                        {item.tags.map(tag => (
                                            <span key={tag} className="text-[10px] text-gray-500 bg-gray-100 px-1.5 rounded border border-gray-200">#{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 justify-center border-l border-gray-100 pl-4">
                                <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil className="w-4 h-4"/></button>
                                <button onClick={() => handleDeleteClick(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash className="w-4 h-4"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ConfirmationModal
                isOpen={isConfirmDeleteOpen}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que quieres eliminar este elemento?"
                onConfirm={executeDelete}
                onCancel={() => setIsConfirmDeleteOpen(false)}
            />

            {notification && (
                <div className={`fixed bottom-5 right-5 z-50 text-white py-3 px-6 rounded-lg shadow-lg animate-slide-up ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                {notification.message}
                </div>
            )}
        </>
    );
};

export default AdminTrainingPage;

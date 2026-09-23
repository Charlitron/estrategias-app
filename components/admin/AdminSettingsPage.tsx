import React, { useState, useEffect } from 'react';
import { Plan } from '../../types';
import EditPlanModal from './EditPlanModal';
import ConfirmationModal from './ConfirmationModal';
import { supabase } from '../../services/supabaseClient';
import { deleteVideoFromUrl, updateAppSettings } from '../../services/database';
import { Trash } from '../icons';

interface AdminSettingsPageProps {
  initialPlans: Plan[];
  initialVideoUrl: string;
  onPlansUpdate: (plans: Plan[]) => void;
  onVideoUrlUpdate: (url: string) => void;
}

const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({
  initialPlans,
  initialVideoUrl,
  onPlansUpdate,
  onVideoUrlUpdate,
}) => {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    // Sync the input field with the prop from parent if it's a YouTube URL
    if (initialVideoUrl && initialVideoUrl.includes('youtube.com')) {
      setVideoUrlInput(initialVideoUrl);
    } else {
      setVideoUrlInput(''); // Clear if it's a Supabase URL
    }
  }, [initialVideoUrl]);

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };
  
  const showNotification = (message: string) => {
      setNotification(message);
      setTimeout(() => setNotification(''), 3000);
  };

  const handleSavePlan = (updatedPlan: Plan) => {
    const updatedPlans = plans.map(p => (p.name === updatedPlan.name ? updatedPlan : p));
    setPlans(updatedPlans);
    onPlansUpdate(updatedPlans); // Update parent state
    setIsModalOpen(false);
    setSelectedPlan(null);
    showNotification(`Plan "${updatedPlan.name}" actualizado exitosamente.`);
  };
  
  const handleVideoUrlSave = async () => {
      const success = await updateAppSettings({ video_url: videoUrlInput });
      if (success) {
        onVideoUrlUpdate(videoUrlInput);
        showNotification('✅ Enlace del video de YouTube guardado.');
      } else {
        showNotification('❌ Error al guardar el enlace del video.');
      }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    showNotification('Subiendo video...');

    const fileName = `main-video-${Date.now()}`;

    try {
        // 1. Upload the file
        const { error: uploadError } = await supabase.storage
            .from('videos')
            .upload(fileName, file, { cacheControl: '3600', upsert: false });
        if (uploadError) throw uploadError;

        // 2. Get the public URL
        const { data } = supabase.storage
            .from('videos')
            .getPublicUrl(fileName);
        if (!data.publicUrl) throw new Error("Could not get public URL for the video.");
        
        // 3. Save the new URL to the database (The critical fix!)
        const success = await updateAppSettings({ video_url: data.publicUrl });
        if (!success) throw new Error("El video se subió pero no se pudo guardar en la configuración.");
        
        // 4. Update the app's state
        onVideoUrlUpdate(data.publicUrl);
        showNotification(`✅ Video "${file.name}" cargado y guardado exitosamente.`);

    } catch (error: any) {
        console.error('Error uploading video:', error);
        showNotification(`❌ Error al subir: ${error.message}`);
    } finally {
        setIsUploading(false);
        if (e.target) e.target.value = ''; // Reset file input
    }
  };
  
  const handleDeleteClick = () => {
      if (!initialVideoUrl.includes('supabase.co')) return;
      setIsConfirmModalOpen(true);
  };
  
  const executeDeleteVideo = async () => {
      setIsDeleting(true);
      showNotification("Eliminando video...");

      const success = await deleteVideoFromUrl(initialVideoUrl);

      if (success) {
          // Also update the setting in the database to a default
          const settingsUpdated = await updateAppSettings({ video_url: 'https://www.youtube.com/embed/videoseries?list=PL-I9-T1pYvL1s3hYh9Ynp0593wR-S2a87' });
          if(settingsUpdated) {
            onVideoUrlUpdate('https://www.youtube.com/embed/videoseries?list=PL-I9-T1pYvL1s3hYh9Ynp0593wR-S2a87'); 
            showNotification("✅ Video eliminado y restaurado al de YouTube por defecto.");
          } else {
            showNotification("⚠️ Video eliminado, pero no se pudo restaurar el de YouTube por defecto.");
          }
      } else {
          showNotification("❌ Error al eliminar el video.");
      }
      setIsDeleting(false);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <>
      {/* Video Settings */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Video de la Página Principal</h2>
        
        <div className="flex items-center justify-between text-sm p-3 bg-blue-50 border border-blue-200 rounded-md mb-6">
            <div className="flex-grow overflow-hidden">
                <strong className="flex-shrink-0">Video Activo:</strong>
                <span className="break-all ml-2">{initialVideoUrl || 'Ninguno'}</span>
            </div>
            {initialVideoUrl.includes('supabase.co') && (
                <button
                    onClick={handleDeleteClick}
                    disabled={isDeleting}
                    className="ml-4 p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    title="Eliminar video actual de Supabase"
                >
                    <Trash className="w-5 h-5" />
                </button>
            )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* YouTube Option */}
          <div className="border border-gray-200 p-4 rounded-lg flex flex-col">
            <h3 className="font-semibold text-gray-800 mb-2">Opción 1: Usar un video de YouTube</h3>
            <p className="text-xs text-gray-500 mb-3 flex-grow">Pega el enlace "embed" o "para insertar" de tu video.</p>
            <div className="flex gap-2 mt-2">
              <input
                id="videoUrl"
                type="text"
                value={videoUrlInput}
                onChange={(e) => setVideoUrlInput(e.target.value)}
                className="flex-grow border border-gray-300 rounded-md py-2 px-3 focus:ring-amber-500 focus:border-amber-500"
                placeholder="https://www.youtube.com/embed/..."
              />
              <button
                onClick={handleVideoUrlSave}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
          
          {/* Local Upload Option */}
          <div className="border border-gray-200 p-4 rounded-lg flex flex-col">
            <h3 className="font-semibold text-gray-800 mb-2">Opción 2: Subir un video desde tu PC</h3>
            <p className="text-xs text-gray-500 mb-3 flex-grow">Sube un archivo de video (MP4, WebM) a Supabase Storage.</p>
            <label 
              htmlFor="video-upload" 
              className={`w-full text-center font-bold py-2 px-5 rounded-lg transition-colors cursor-pointer mt-2 ${
                isUploading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-amber-400 hover:bg-amber-500 text-gray-900'
              }`}
            >
              {isUploading ? 'Subiendo...' : 'Seleccionar Archivo de Video'}
            </label>
            <input 
              type="file" 
              id="video-upload" 
              accept="video/mp4,video/webm" 
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-2">Nota: El video se alojará de forma pública en Supabase Storage.</p>
          </div>
        </div>
      </div>
      
      {/* Plans Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Administrar Planes</h2>
        <div className="space-y-6">
          {plans.map(plan => (
            <div key={plan.name} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
                <p className="text-gray-600 mt-1">{plan.description}</p>
                <div className="text-2xl font-bold text-amber-600 mt-2">${plan.price.toLocaleString('es-MX')} MXN</div>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                <button
                  onClick={() => handleEditPlan(plan)}
                  className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-2 px-5 rounded-lg transition-colors"
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {isModalOpen && selectedPlan && (
        <EditPlanModal
          plan={selectedPlan}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSavePlan}
        />
      )}
      
       <ConfirmationModal
        isOpen={isConfirmModalOpen}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar el video activo? Esta acción no se puede deshacer y borrará el archivo permanentemente."
        onConfirm={() => {
          setIsConfirmModalOpen(false);
          executeDeleteVideo();
        }}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
      
      {/* Notification Toast */}
       {notification && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg animate-slide-up">
          {notification}
        </div>
      )}
    </>
  );
};

export default AdminSettingsPage;
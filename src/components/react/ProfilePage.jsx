import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Cart } from './Cart';
import { CartProvider } from '../../context/cart';
import { FiltersProvider } from '../../context/filter';
import UserMenu from './UserMenu';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.href = '/';
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success && data.user) {
        setUser(data.user);
        setFormData({
          name: data.user.name,
          email: data.user.email,
        });
        // Actualizar localStorage con los datos completos del usuario
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    } catch (error) {
      localStorage.removeItem('token');
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      // Actualizar datos de perfil
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        let updatedUser = data.user;
        
        // Si hay foto, subirla
        if (photoFile) {
          const formData = new FormData();
          formData.append('avatar', photoFile);
          
          const photoResponse = await fetch('/api/users/me/avatar', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });

          const photoData = await photoResponse.json();
          
          if (photoData.success) {
            updatedUser = photoData.user;
          }
        }
        
        // Actualizar el estado local
        setUser(updatedUser);
        
        // Actualizar localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Disparar evento personalizado para que UserMenu se actualice
        window.dispatchEvent(new Event('userUpdated'));
        
        setIsEditing(false);
        setPhotoFile(null);
        setPhotoPreview(null);
        alert('Perfil actualizado correctamente');
      } else {
        alert(data.error || 'Error al actualizar perfil');
      }
    } catch (error) {
      alert('Error al actualizar perfil');
    }
  };

  if (loading) {
    return (
      <CartProvider>
        <FiltersProvider>
          <Header onCartClick={() => setIsCartOpen(!isCartOpen)}>
            <UserMenu onLogout={handleLogout} />
          </Header>
          <Cart isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
              <p className="text-gray-600 text-lg">Cargando perfil...</p>
            </div>
          </div>
          <Footer />
        </FiltersProvider>
      </CartProvider>
    );
  }

  return (
    <CartProvider>
      <FiltersProvider>
        <Header onCartClick={() => setIsCartOpen(!isCartOpen)}>
          <UserMenu onLogout={handleLogout} />
        </Header>
        <Cart isOpen={isCartOpen} setIsOpen={setIsCartOpen} />

        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition-colors font-medium"
                >
                  Editar perfil
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-6">
                {/* Foto de perfil */}
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Información de la cuenta</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Miembro desde:</span>
                      <span className="font-medium">
                        {new Date(user?.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Foto de perfil */}
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {(photoPreview || user?.avatar) ? (
                      <img
                        src={photoPreview || user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Foto de perfil
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="text-sm text-gray-600"
                    />
                  </div>
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* Email (solo lectura) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600">
                    {user.email}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">El correo electrónico no se puede modificar</p>
                </div>

                {/* Botones */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition-colors font-medium"
                  >
                    Guardar cambios
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setPhotoFile(null);
                      setPhotoPreview(null);
                      setFormData({
                        name: user.name,
                        email: user.email,
                      });
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>

        <Footer />
      </FiltersProvider>
    </CartProvider>
  );
}

"use client";

import { useState, useEffect, useRef } from "react"; // Agregamos useRef
import axios from "axios";
import Link from "next/link";
import { Filter, X, Loader2, Search } from "lucide-react"; // Agregamos Search
import { Button } from "@/components/ui/button";

import { makeClothesService } from "@/clothes/services/clothes.service";

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
});
const clothesService = makeClothesService(apiInstance);

export default function CatalogPage() {
  // --- A. ESTADOS ---
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Estados de Filtros
  const [busqueda, setBusqueda] = useState("");
  const [categorias, setCategorias] = useState<string[]>([]);
  const [colores, setColores] = useState<string[]>([]);
  const [tallas, setTallas] = useState<string[]>([]);
  const [rangoPrecio, setRangoPrecio] = useState<string>(""); 

  // --- NUEVO: ESTADOS PARA EL AUTOCOMPLETADO ---
  const [sugerencias, setSugerencias] = useState<any[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null); // Para detectar clics fuera

  // Listas de Opciones (Tus listas actuales)
  const opcionesCategorias = ["Vestidos", "Blazers", "Pantalones", "Tops", "Camisas", "Accesorios"];
  const opcionesColores = ["Negro", "Blanco", "Azul", "Beige", "Dorado", "Rojo"];
  const opcionesTallas = ["XS", "S", "M", "L", "XL"];

  // --- B. CARGAR PRODUCTOS (Tu función original) ---
  const cargarProductos = async (filtroBusqueda = busqueda) => {
    setLoading(true);
    try {
      let min = undefined;
      let max = undefined;

      if (rangoPrecio === "menos-200") { max = 200; }
      else if (rangoPrecio === "200-500") { min = 200; max = 500; }
      else if (rangoPrecio === "500-1000") { min = 500; max = 1000; }
      else if (rangoPrecio === "mas-1000") { min = 1000; }

      const data = await clothesService.getMainCatalog({
        busqueda: filtroBusqueda, // Usamos el argumento o el estado
        categorias,
        colores,
        tallas,
        precioMin: min,
        precioMax: max
      });
      
      setProductos(data);
    } catch (error) {
      console.error("Error cargando catálogo", error);
    } finally {
      setLoading(false);
    }
  };

  // --- NUEVO: FUNCIÓN PARA MANEJAR LO QUE ESCRIBES ---
  const handleBusquedaChange = async (texto: string) => {
    setBusqueda(texto);

    if (texto.length > 2) {
      // Solo buscamos sugerencias si hay más de 2 letras
      try {
        // Reutilizamos el servicio para buscar coincidencias
        const data = await clothesService.getMainCatalog({ busqueda: texto });
        // Guardamos solo los primeros 5 resultados para la lista desplegable
        setSugerencias(data.slice(0, 5)); 
        setMostrarSugerencias(true);
      } catch (error) {
        console.error("Error buscando sugerencias", error);
      }
    } else {
      setSugerencias([]);
      setMostrarSugerencias(false);
    }
  };

  // --- NUEVO: AL SELECCIONAR UNA SUGERENCIA ---
  const seleccionarSugerencia = (nombreProducto: string) => {
    setBusqueda(nombreProducto);
    setMostrarSugerencias(false);
    // Forzamos la carga inmediata con el nombre seleccionado
    cargarProductos(nombreProducto);
  };

  // --- NUEVO: CERRAR SUGERENCIAS SI HACES CLIC FUERA ---
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setMostrarSugerencias(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);


  // --- C. EFECTO DE RECARGA (Debounce) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      cargarProductos();
    }, 400); 
    return () => clearTimeout(timer);
  }, [busqueda, categorias, colores, tallas, rangoPrecio]);

  // --- D. HELPERS ---
  const toggleFilter = (valor: string, estadoActual: string[], setEstado: any) => {
    if (estadoActual.includes(valor)) {
      setEstado(estadoActual.filter((v: string) => v !== valor));
    } else {
      setEstado([...estadoActual, valor]);
    }
  };

  const handlePrecioChange = (valor: string) => {
    if (rangoPrecio === valor) setRangoPrecio("");
    else setRangoPrecio(valor);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen font-sans text-gray-900">
      
      {/* HEADER Y BOTÓN MÓVIL */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Catálogo</h1>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 md:hidden bg-transparent"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* --- SIDEBAR DE FILTROS --- */}
        <div className={`${showFilters ? "block" : "hidden"} md:block md:col-span-1`}>
          <div className="space-y-6 p-4 border border-gray-200 rounded-xl bg-white sticky top-24 shadow-sm">
            
            <div className="flex items-center justify-between md:hidden">
              <h3 className="font-semibold">Filtros</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* --- NUEVO: BUSCADOR CON AUTOCOMPLETADO --- */}
            <div className="relative" ref={wrapperRef}>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar prenda..." 
                  className="w-full border border-gray-300 rounded-lg p-2 pl-9 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                  value={busqueda}
                  onChange={(e) => handleBusquedaChange(e.target.value)}
                  onFocus={() => busqueda.length > 2 && setMostrarSugerencias(true)}
                />
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              </div>

              {/* LISTA DESPLEGABLE (DROPDOWN) */}
              {mostrarSugerencias && sugerencias.length > 0 && (
                <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                  <ul>
                    {sugerencias.map((prod) => (
                      <li 
                        key={prod.id_prenda}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-3"
                        onClick={() => seleccionarSugerencia(prod.nombre_prenda)}
                      >
                        {/* Pequeña miniatura en la sugerencia */}
                        <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                           {prod.url_imagen ? (
                             <img src={prod.url_imagen} className="w-full h-full object-cover" />
                           ) : null}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{prod.nombre_prenda}</span>
                          <span className="text-xs text-gray-500">S/ {prod.precio_prenda}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Categorías */}
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Categoría</h3>
              <div className="space-y-2">
                {opcionesCategorias.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity">
                    <input
                      type="checkbox"
                      checked={categorias.includes(cat)}
                      onChange={() => toggleFilter(cat, categorias, setCategorias)}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm text-gray-600">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Colores */}
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Color</h3>
              <div className="space-y-2">
                {opcionesColores.map((color) => (
                  <label key={color} className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity">
                    <input
                      type="checkbox"
                      checked={colores.includes(color)}
                      onChange={() => toggleFilter(color, colores, setColores)}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm text-gray-600">{color}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tallas */}
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Talla</h3>
              <div className="space-y-2">
                {opcionesTallas.map((size) => (
                  <label key={size} className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity">
                    <input
                      type="checkbox"
                      checked={tallas.includes(size)}
                      onChange={() => toggleFilter(size, tallas, setTallas)}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm text-gray-600">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Precio */}
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Precio</h3>
              <div className="space-y-2">
                {[
                  { label: "Menos de S/ 200", val: "menos-200" },
                  { label: "S/ 200 - S/ 500", val: "200-500" },
                  { label: "S/ 500 - S/ 1000", val: "500-1000" },
                  { label: "Más de S/ 1000", val: "mas-1000" }
                ].map((opcion) => (
                  <label key={opcion.val} className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity">
                    <input
                      type="checkbox"
                      checked={rangoPrecio === opcion.val}
                      onChange={() => handlePrecioChange(opcion.val)}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm text-gray-600">{opcion.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* --- GRILLA DE PRODUCTOS --- */}
        <div className="md:col-span-3">
          
          {loading ? (
             <div className="flex items-center justify-center h-64">
               <Loader2 className="animate-spin w-8 h-8 text-black" />
             </div>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productos.map((product) => (
                <div
                  key={product.id_prenda}
                  className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white"
                >
                  {/* Imagen */}
                  <div className="w-full h-80 bg-gray-100 relative overflow-hidden">
                    {product.url_imagen && !product.url_imagen.includes("placeholder") ? (
                      <img
                        src={product.url_imagen}
                        alt={product.nombre_prenda}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-50">👗</div>
                    )}

                    {/* Overlay Botón */}
                    <div className="absolute inset-x-0 bottom-4 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link href={`/customer/product/${product.id_prenda}`}>
                        <button className="w-full bg-white text-black font-bold py-3 text-sm uppercase tracking-widest shadow-lg hover:bg-black hover:text-white transition-colors">
                          Ver Producto
                        </button>
                      </Link>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-orange-500 font-bold mb-2 uppercase tracking-widest">
                      {product.categoria_prendas}
                    </p>
                    <h3 className="font-bold text-gray-900 mb-2 truncate group-hover:text-orange-500 transition-colors">
                      {product.nombre_prenda}
                    </h3>
                    <div className="flex items-center justify-between border-t pt-3 border-gray-100">
                      <span className="text-lg font-bold text-gray-900">
                        S/ {typeof product.precio_prenda === 'number' ? product.precio_prenda.toFixed(2) : product.precio_prenda}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && productos.length === 0 && (
             <div className="flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
               <p className="text-lg font-medium">No encontramos productos.</p>
               <p className="text-sm mb-4">Intenta con otro término de búsqueda.</p>
               <button 
                 onClick={() => {setCategorias([]); setColores([]); setTallas([]); setBusqueda(""); setRangoPrecio("")}}
                 className="text-black font-semibold underline hover:text-orange-500"
               >
                 Limpiar filtros
               </button>
             </div>
          )}
        </div>

      </div>
    </div>
  )
}
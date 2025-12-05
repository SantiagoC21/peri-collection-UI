"use client"

import { useFetchClientsInfo } from "@/hooks/useFetchClients"
import { Loader2, Plus, MapPinHouse, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Modal from "./modal"
import { useApiClient } from "@/lib/api/useApiClient"
import { makeClientService } from "@/clients/services/client.service"
import { useMemo, useState } from "react"

export default function DirectionsPage() {
    const api = useApiClient()
    const clientService = useMemo(() => makeClientService(api), [api])
    const [isDirectionModalOpen, setIsDirectionModalOpen] = useState(false)
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
    const [pais, setPais] = useState("")
    const [departamento, setDepartamento] = useState("")
    const [provincia, setProvincia] = useState("")
    const [distrito, setDistrito] = useState("")
    const [calle, setCalle] = useState("")
    const [esPredeterminada, setEsPredeterminada] = useState(false)
    const [saving, setSaving] = useState(false)
    const [directionError, setDirectionError] = useState<string | null>(null)
    const [directionToDelete, setDirectionToDelete] = useState<{
        id_direccion: number
        calle: string
    } | null>(null)

    const { directions, isLoading, error } = useFetchClientsInfo()

    const resetForm = () => {
        setPais("")
        setDepartamento("")
        setProvincia("")
        setDistrito("")
        setCalle("")
        setEsPredeterminada(false)
        setDirectionError(null)
    }

    const handleDirectionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!calle.trim() || !departamento.trim() || !provincia.trim() || !distrito.trim() || !pais.trim()) {
            return
        }

        setSaving(true)
        try {
            setDirectionError(null)
            await clientService.insertDirection({
                pais: pais.trim(),
                departamento: departamento.trim(),
                provincia: provincia.trim(),
                distrito: distrito.trim(),
                calle: calle.trim(),
                es_predeterminada: esPredeterminada,
            })
            setIsDirectionModalOpen(false)
            resetForm()
            if (typeof window !== "undefined") {
                window.location.reload()
            }
        } catch (err: any) {
            const backendMessage: string | undefined = err?.response?.data?.message
            if (backendMessage) {
                setDirectionError(backendMessage)
            } else {
                setDirectionError("Ocurrió un error al registrar la dirección")
            }
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteDirection = async (id_direccion: number) => {
        try {
            await clientService.deleteDirection(id_direccion)
            if (typeof window !== "undefined") {
                window.location.reload()
            }
        } catch (err) {
            console.error(err)
        }
    }

    if (isLoading){
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin" />
            </div>
        )
    }

    if (error){
        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground mb-2">Mis Direcciones</h2>
                <div className="flex items-center justify-center h-screen">
                    <p className="text-red-500">Error al cargar las direcciones</p>
                </div>
            </div>
        )
    }
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Mis Direcciones</h2>
            {directions.length === 0 ? (
                <>
                    <div className="flex items-center justify-between border-b pb-4">
                    </div>
                    <div className="flex flex-col items-center justify-center py-10 border-1 border-gray-300 rounded-xl bg-gray-100/50 text-center">
                        <MapPinHouse 
                            size={96} 
                            className="text-gray-400 mb-4 opacity-75"
                        />
                        <h3 className="text-xl font-medium text-gray-600 mb-2">
                            Aún no tienes direcciones guardadas
                        </h3>
                        <Button
                            className="ml-2"
                            onClick={() => setIsDirectionModalOpen(true)}>
                            <Plus className="w-4 h-4 mr-1" />
                            Agregar Dirección
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    {directions.map((direction, index) => (
                        <div key={direction.id_direccion ?? index} className="border border-border rounded-xl p-6 bg-card">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-foreground">{direction.calle}</h3>
                                    <p className="text-sm text-muted-foreground">{direction.departamento + ", " + direction.provincia + ", " + direction.distrito}</p>
                                </div>
                                <div className="text-right">
                                    <div className="mt-2 flex items-center justify-end gap-2">
                                        {direction.es_predeterminada && (
                                            <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                                                Predeterminada
                                            </span>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                setDirectionToDelete({
                                                    id_direccion: direction.id_direccion,
                                                    calle: direction.calle,
                                                })
                                                setIsConfirmDeleteOpen(true)
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <Button
                            className="ml-2"
                            onClick={() => setIsDirectionModalOpen(true)}>
                            <Plus className="w-4 h-4 mr-1" />
                            Agregar Dirección
                        </Button>
                    </div>
                </>
            )}

            <Modal isOpen={isDirectionModalOpen} onClose={() => { setIsDirectionModalOpen(false); resetForm() }}>
                <h3 className="text-lg font-semibold mb-2">Agregar dirección</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Completa los datos de tu dirección de envío.
                </p>
                <form onSubmit={handleDirectionSubmit} className="space-y-4">
                    <div>
                        <Label className="block text-sm font-medium text-foreground mb-2">País</Label>
                        <Input
                            type="text"
                            value={pais}
                            onChange={(e) => setPais(e.target.value)}
                            placeholder="Ingresa el país"
                        />
                    </div>
                    <div>
                        <Label className="block text-sm font-medium text-foreground mb-2">Departamento</Label>
                        <Input
                            type="text"
                            value={departamento}
                            onChange={(e) => setDepartamento(e.target.value)}
                            placeholder="Ingresa el departamento"
                        />
                    </div>
                    <div>
                        <Label className="block text-sm font-medium text-foreground mb-2">Provincia</Label>
                        <Input
                            type="text"
                            value={provincia}
                            onChange={(e) => setProvincia(e.target.value)}
                            placeholder="Ingresa la provincia"
                        />
                    </div>
                    <div>
                        <Label className="block text-sm font-medium text-foreground mb-2">Distrito</Label>
                        <Input
                            type="text"
                            value={distrito}
                            onChange={(e) => setDistrito(e.target.value)}
                            placeholder="Ingresa el distrito"
                        />
                    </div>
                    <div>
                        <Label className="block text-sm font-medium text-foreground mb-2">Calle / Dirección</Label>
                        <Input
                            type="text"
                            value={calle}
                            onChange={(e) => setCalle(e.target.value)}
                            placeholder="Ingresa la dirección"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            id="esPredeterminada"
                            type="checkbox"
                            checked={esPredeterminada}
                            onChange={(e) => setEsPredeterminada(e.target.checked)}
                            className="h-4 w-4"
                        />
                        <Label htmlFor="esPredeterminada" className="text-sm text-foreground">
                            Marcar como dirección predeterminada
                        </Label>
                    </div>
                    {directionError && (
                        <p className="text-sm text-red-500 mt-1">{directionError}</p>
                    )}
                    <div className="flex justify-end mt-4">
                        <Button
                            type="button"
                            onClick={() => { setIsDirectionModalOpen(false); resetForm() }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="ml-2"
                            disabled={saving}
                        >
                            {saving ? "Guardando..." : "Guardar"}
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isConfirmDeleteOpen}
                onClose={() => {
                    setIsConfirmDeleteOpen(false)
                    setDirectionToDelete(null)
                }}
            >
                <h3 className="text-lg font-semibold mb-2">Eliminar dirección</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    ¿Estás seguro de que deseas eliminar la dirección
                    {" "}
                    <span className="font-semibold">
                        {directionToDelete?.calle ?? "seleccionada"}
                    </span>
                    ? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setIsConfirmDeleteOpen(false)
                            setDirectionToDelete(null)
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={async () => {
                            if (!directionToDelete) return
                            await handleDeleteDirection(directionToDelete.id_direccion)
                            setIsConfirmDeleteOpen(false)
                            setDirectionToDelete(null)
                        }}
                    >
                        Eliminar
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

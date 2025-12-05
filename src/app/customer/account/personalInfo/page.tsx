"use client"

import { useMemo, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useFetchClientsInfo } from "@/hooks/useFetchClients"
import { Loader2 } from "lucide-react"
import { DisplayField } from "@/components/ui/displayField"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Modal from "./modalPersonalInfo/CambiarNombre"
import { useApiClient } from "@/lib/api/useApiClient"
import { makeClientService } from "@/clients/services/client.service"

export default function PersonalInfoPage() {
  const api = useApiClient()
  const clientService = useMemo(() => makeClientService(api), [api])

  const { personalInfo, isLoading, error } = useFetchClientsInfo()
  const [isNameModalOpen, setIsNameModalOpen] = useState(false)
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [saving, setSaving] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)

  useEffect(() => {
    if (personalInfo) {
      setFirstName(personalInfo.nombres_completos)
      setLastName(personalInfo.apellidos_completos)
      setPhone(personalInfo.telefono)
    }
  }, [personalInfo])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) return

    setSaving(true)
    try {
      setNameError(null)
      await clientService.updatePersonalInfo({
        nombres_completos: firstName.trim(),
        apellidos_completos: lastName.trim(),
      })
      setIsNameModalOpen(false)
      if (typeof window !== "undefined") {
        window.location.reload()
      }
    } catch (err: any) {
      const backendMessage: string | undefined = err?.response?.data?.message
      if (backendMessage) {
        setNameError(backendMessage)
      } else {
        setNameError("Ocurrió un error al actualizar tus datos")
      }
    } finally {
      setSaving(false)
    }
  }

  const handlePhoneSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!phone.trim()) return

    setSaving(true)
    try {
      setPhoneError(null)
      await clientService.updatePhone({
        telefono: phone.trim(),
      })
      setIsPhoneModalOpen(false)
      if (typeof window !== "undefined") {
        window.location.reload()
      }
    } catch (err: any) {
      const backendMessage: string | undefined = err?.response?.data?.message
      if (backendMessage) {
        setPhoneError(backendMessage)
      } else {
        setPhoneError("Ocurrió un error al actualizar tu teléfono")
      }
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500">Error al cargar datos personales: {error}</p>
  }

  if (!personalInfo) {
    return <p className="text-muted-foreground">No se encontraron datos personales</p>
  }

  return (
    <div className="border border-border rounded-xl p-6 bg-card">
      <h2 className="text-2xl font-semibold text-foreground mb-6">Información Personal</h2>
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="relative">
          <div>
            <Label className="block text-sm font-medium text-foreground mb-2">
              Nombre y Apellidos
            </Label>
            <DisplayField className="block w-full">
              {personalInfo.nombres_completos + " " + personalInfo.apellidos_completos}
            </DisplayField>
          </div>
          <button
            className="text-sm font-medium text-blue-600 hover:underline absolute right-0 top-0"
            onClick={() => setIsNameModalOpen(true)}
          >
            Editar
          </button>
        </div>
        <div>
          <Label className="block text-sm font-medium text-foreground mb-2">Correo Electrónico</Label>
          <DisplayField>{personalInfo.email}</DisplayField>
        </div>
        <div>
          <Label className="block text-sm font-medium text-foreground mb-2">Documento</Label>
          <DisplayField>{personalInfo.tipo_documento + " " + personalInfo.numero_documento}</DisplayField>
        </div>
        <div className="relative">
          <div>
            <Label className="block text-sm font-medium text-foreground mb-2">Teléfono</Label>
            <DisplayField className="block w-full">
              {personalInfo.telefono}
            </DisplayField>
          </div>
          <button className="text-sm font-medium text-blue-600 hover:underline absolute right-0 top-0"
          onClick={() => setIsPhoneModalOpen(true)}>
            Editar
          </button>
        </div>
      </div>
      <Modal isOpen={isNameModalOpen} onClose={() => setIsNameModalOpen(false)}>
        {/* Aquí puedes colocar el contenido del modal para cambiar nombre */}
        <h3 className="text-lg font-semibold mb-2">Cambiar nombre</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Modifica tus Nombres y Apellidos para el envio de tus compras
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label className="block text-sm font-medium text-foreground mb-2">
              Nombres Completos
            </Label>
            <Input
              type="text"
              placeholder="Ingresa tus nombres y apellidos"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label className="block text-sm font-medium text-foreground mb-2">
              Apellidos Completos
            </Label>
            <Input
              type="text"
              placeholder="Ingresa tus apellidos"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          {nameError && (
            <p className="text-sm text-red-500 mt-1">{nameError}</p>
          )}
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => setIsNameModalOpen(false)}
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





      <Modal isOpen={isPhoneModalOpen} onClose={() => setIsPhoneModalOpen(false)}>
        {/* Aquí puedes colocar el contenido del modal para cambiar nombre */}
        <h3 className="text-lg font-semibold mb-2">Cambiar telefono</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Modifica tu numero de telefono para validar la entrega
        </p>
        <form onSubmit={handlePhoneSubmit}>
          <div className="mb-4">
            <Label className="block text-sm font-medium text-foreground mb-2">
              Celular
            </Label>
            <Input
              type="text"
              placeholder="Ingresa tu numero de celular"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          {phoneError && (
            <p className="text-sm text-red-500 mt-1">{phoneError}</p>
          )}
          
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => setIsPhoneModalOpen(false)}
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
    </div>
  )
}

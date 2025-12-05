"use client"

import Image from "next/image"
import { useFetchClientsInfo } from "@/hooks/useFetchClients"
import { Loader2, Plus, CreditCard, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApiClient } from "@/lib/api/useApiClient"
import { useMemo } from "react"
import type React from "react"
import { makeClientService } from "@/clients/services/client.service"
import { useState } from "react"

import Modal from "./modal"
import Visa from "@/assets/visa.svg"
import Mastercard from "@/assets/mastercard.svg"
import AmericanExpress from "@/assets/americanExpress.svg"
import Discover from "@/assets/discover.svg"
import UnionPay from "@/assets/unionPay.svg"
import JCB from "@/assets/jcb.svg"
import DinersClubInternational from "@/assets/dinersClub.svg"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


function convertirExpiracionAISO(expirationString: string) {

    const partes = expirationString.split('/');
    if (partes.length !== 2) {
        return null;
    }
    let mes = partes[0].trim();
    let anioCorta = partes[1].trim();
    if (mes.length !== 2 || anioCorta.length !== 2) {
        return null;
    }
    const month = parseInt(mes, 10);
    const yearShort = parseInt(anioCorta, 10);
    if (month < 1 || month > 12) {
        return null;
    }
    const yearFull = 2000 + yearShort;
    const dia = '01'; 
    const monthPadded = String(month).padStart(2, '0');
    const fechaISO = `${yearFull}-${monthPadded}-${dia}`;
    
    return fechaISO;
}

export default function PaymentMethodsPage() {
    const api = useApiClient()  
    const clientService = useMemo(() => makeClientService(api), [api])
    const { paymentMethods, isLoading, error } = useFetchClientsInfo()

    const [isMethodModalOpen, setIsMethodModalOpen] = useState(false)
    const [tipo, setTipo] = useState<"C" | "D">("C")
    const [marca, setMarca] = useState<string>("")

    const [ultimos_digitos, setUltimosDigitos] = useState("")
    const [fecha_vencimiento, setFechaVencimiento] = useState("")
    const [codigo_seguridad, setCodigoSeguridad] = useState("")
    const [es_predeterminado, setEsPredeterminado] = useState(false)
    const [saving, setSaving] = useState(false)
    const [isSettingDefault, setIsSettingDefault] = useState(false)
    const [paymentMethodError, setPaymentMethodError] = useState<string | null>(null)
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
    const [methodPageToDelete, setMethodPageToDelete] = useState<{
        id_metodo_pago: number
        tipo: "C" | "D"
    } | null>(null)

    const openMethodModal = (cardType: "C" | "D") => {
        setTipo(cardType)
        setMarca("")
        setUltimosDigitos("")
        setFechaVencimiento("")
        setCodigoSeguridad("")
        setEsPredeterminado(false)
        setPaymentMethodError(null)
        setIsMethodModalOpen(true)
    }

    enum Marcas {
        Visa = "VISA",
        Mastercard = "MASTERCARD",
        AmericanExpress = "AMERICAN EXPRESS",
        Discover = "DISCOVER",
        UnionPay = "UNION PAY",
        Jcb = "JCB",
        DinersClubInternational = "DINERS CLUB INTERNATIONAL"
    }

    const handleFechaVencimientoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "")
        value = value.slice(0, 4)

        if (value.length >= 3) {
            value = `${value.slice(0, 2)}/${value.slice(2, 4)}`
        }

        setFechaVencimiento(value)
    }

    const resetForm = () => {
        setTipo("C")
        setMarca("")

        setUltimosDigitos("")
        setFechaVencimiento("")
        setCodigoSeguridad("")
        setEsPredeterminado(false)
        setPaymentMethodError(null)
    }

    const handlePaymentMethodSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!tipo.trim() || !ultimos_digitos.trim() || !fecha_vencimiento.trim() || !codigo_seguridad.trim()) {
            return
        }

        setSaving(true)
        try {
            setPaymentMethodError(null)
            const fechaISO = convertirExpiracionAISO(fecha_vencimiento)

            if (!fechaISO) {
                setPaymentMethodError("La fecha de vencimiento no es válida. Use el formato MM/AA.")
                setSaving(false)
                return
            }
            const digitsOnly = ultimos_digitos.replace(/\D/g, "")

            await clientService.insertPaymentMethod({
                tipo: tipo,
                marca: marca.trim(),
                ultimos_digitos: digitsOnly,
                fecha_vencimiento: fechaISO,
                codigo_seguridad: codigo_seguridad.trim(),
                es_predeterminado: es_predeterminado,
            })
            setIsMethodModalOpen(false)
            resetForm()
            if (typeof window !== "undefined") {
                window.location.reload()
            }
        } catch (err: any) {
            const backendMessage: string | undefined = err?.response?.data?.message
            if (backendMessage) {
                setPaymentMethodError(backendMessage)
            } else {
                setPaymentMethodError("Ocurrió un error al registrar el metodo de pago")
            }
        } finally {
            setSaving(false)
        }
    }

    const handleSetDefaultPaymentMethod = async (id_metodo_pago: number) => {
        try {
            setIsSettingDefault(true)
            await clientService.setDefaultPaymentMethod({ id_metodo_pago })
            if (typeof window !== "undefined") {
                window.location.reload()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsSettingDefault(false)
        }
    }

    const handleDeletePaymentMethod = async (id: number) => {
        try {
            await clientService.deletePaymentMethod(id)
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
                <h2 className="text-2xl font-semibold text-foreground mb-2">Mis Metodos de Pago</h2>
                <div className="flex items-center justify-center h-screen">
                    <p className="text-red-500">Error al cargar las direcciones</p>
                </div>
            </div>
        )
    }

    const creditMethods = paymentMethods.filter((pm) => pm.tipo === "C")
    const debitMethods = paymentMethods.filter((pm) => pm.tipo === "D")

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Mis Metodos de Pago</h2>
            {paymentMethods.length === 0 ? (
                <>
                    <div className="flex items-center justify-between border-b pb-4">
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Tus tarjetas de Credito</h3>
                        <div className="flex flex-col items-center justify-center py-10 border-1 border-gray-300 rounded-xl bg-gray-100/50 text-center">
                            <CreditCard 
                                size={96} 
                                className="text-gray-400 mb-4 opacity-75"
                            />
                            <h3 className="text-xl font-medium text-gray-600 mb-2">
                                Aún no tienes tarjetas de credito guardadas
                            </h3>
                            <Button
                                id="add-credit-card"
                                className="ml-2 cursor-pointer"
                                onClick={() => openMethodModal("C")}>
                                <Plus className="w-4 h-4 mr-1" />
                                Agregar tarjeta
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Tus tarjetas de Debito</h3>
                        <div className="flex flex-col items-center justify-center py-10 border-1 border-gray-300 rounded-xl bg-gray-100/50 text-center">
                            <CreditCard 
                                size={96} 
                                className="text-gray-400 mb-4 opacity-75"
                            />
                            <h3 className="text-xl font-medium text-gray-600 mb-2">
                                Aún no tienes tarjetas de debito guardadas
                            </h3>
                            <Button
                                id="add-debit-card"
                                className="ml-2 cursor-pointer"
                                onClick={() => openMethodModal("D")}>
                                <Plus className="w-4 h-4 mr-1" />
                                Agregar tarjeta
                            </Button>
                        </div>
                    </div>
                </>

            ) : (
                <>
                    {/* Tarjetas de Crédito */}
                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Tus tarjetas de Credito</h3>
                        {creditMethods.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 border-1 border-gray-300 rounded-xl bg-gray-100/50 text-center">
                                <CreditCard 
                                    size={96} 
                                    className="text-gray-400 mb-4 opacity-75"
                                />
                                <h3 className="text-xl font-medium text-gray-600 mb-2">
                                    Aún no tienes tarjetas de credito guardadas
                                </h3>
                                <Button
                                    id="add-credit-card"
                                    className="ml-2 cursor-pointer"
                                    onClick={() => openMethodModal("C")}>
                                    <Plus className="w-4 h-4 mr-1" />
                                    Agregar tarjeta
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="border border-border rounded-xl p-6 bg-card">
                                    <div className="card-container">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="py-2 pr-4 w-28">
                                                        <div className="flex items-center gap-2">
                                                            <span>Preferido</span>
                                                            {isSettingDefault && (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            )}
                                                        </div>
                                                    </th>

                                                    <th className="py-2 pr-4 w-40">Marca</th>
                                                    <th className="py-2 pr-4 w-48">Últimos dígitos</th>
                                                    <th className="py-2 pr-4 w-48">Fecha de vencimiento</th>
                                                    <th className="py-2 text-right w-32">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {creditMethods.map((paymentMethod, index) => (
                                                    <tr key={index}>
                                                        <td className="preferida-col py-2 pr-4 align-middle">
                                                            <input
                                                                type="radio"
                                                                name="prefer-payment-method"
                                                                checked={paymentMethod.es_predeterminada}
                                                                disabled={isSettingDefault}
                                                                onChange={() => handleSetDefaultPaymentMethod(paymentMethod.id_metodo_pago)}
                                                            />
                                                        </td>

                                                        <td className="py-2 pr-4 align-middle">
                                                            <div className="flex items-center gap-2">
                                                                {paymentMethod.marca === Marcas.Visa && (
                                                                    <Image src={Visa} alt="Visa" width={100} height={100} className="w-8 h-auto" />
                                                                )}
                                                                {paymentMethod.marca === Marcas.Mastercard && (
                                                                    <Image src={Mastercard} alt="Mastercard" width={100} height={100} className="w-8 h-auto" />
                                                                )}
                                                                {paymentMethod.marca === Marcas.AmericanExpress && (
                                                                    <Image src={AmericanExpress} alt="American Express" width={100} height={100} className="w-8 h-auto" />
                                                                )}
                                                                {paymentMethod.marca === Marcas.Discover && (
                                                                    <Image src={Discover} alt="Discover" width={100} height={100} className="w-8 h-auto" />
                                                                )}
                                                                {paymentMethod.marca === Marcas.UnionPay && (
                                                                    <Image src={UnionPay} alt="Union Pay" width={100} height={100} className="w-8 h-auto" />
                                                                )}
                                                                {paymentMethod.marca === Marcas.Jcb && (
                                                                    <Image src={JCB} alt="JCB" width={100} height={100} className="w-8 h-auto" />
                                                                )}
                                                                {paymentMethod.marca === Marcas.DinersClubInternational && (
                                                                    <Image
                                                                        src={DinersClubInternational}
                                                                        alt="Diners Club"
                                                                        width={100}
                                                                        height={100}
                                                                        className="w-8 h-auto"
                                                                    />
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="ultimos-digitos-col py-2 pr-4 align-middle">
                                                            xxxx xxxx xxxx {paymentMethod.ultimos_digitos.toString().slice(-4)}
                                                        </td>
                                                        <td className="fecha-vencimiento-col py-2 pr-4 align-middle">
                                                            {paymentMethod.fecha_vencimiento.toLocaleString("en-US",
                                                                {
                                                                    month: "short",
                                                                    year: "numeric"
                                                                }
                                                            )}
                                                        </td>
                                                        <td className="py-2 text-right align-middle">
                                                            <Button
                                                                id="delete-credit-card"
                                                                variant="outline"
                                                                size="icon"
                                                                className="ml-2 cursor-pointer"
                                                                onClick={() => {
                                                                    setMethodPageToDelete({
                                                                        id_metodo_pago: paymentMethod.id_metodo_pago,
                                                                        tipo: paymentMethod.tipo
                                                                    })
                                                                    setIsConfirmDeleteOpen(true)
                                                                }}>
                                                                <Trash className="w-4 h-4 mr-1" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        className="ml-2"
                                        onClick={() => setIsMethodModalOpen(true)}>
                                        <Plus className="w-4 h-4 mr-1" />
                                        Agregar Tarjeta
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tarjetas de Débito */}
                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Tus tarjetas de Debito</h3>
                        {debitMethods.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 border-1 border-gray-300 rounded-xl bg-gray-100/50 text-center">
                                <CreditCard 
                                    size={96} 
                                    className="text-gray-400 mb-4 opacity-75"
                                />
                                <h3 className="text-xl font-medium text-gray-600 mb-2">
                                    Aún no tienes tarjetas de debito guardadas
                                </h3>
                                <Button
                                    id="add-debit-card"
                                    className="ml-2 cursor-pointer"
                                    onClick={() => openMethodModal("D")}>
                                    <Plus className="w-4 h-4 mr-1" />
                                    Agregar tarjeta
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="border border-border rounded-xl p-6 bg-card">
                                    <div className="card-container">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="py-2 pr-4 w-28">
                                                        <div className="flex items-center gap-2">
                                                            <span>Preferido</span>
                                                            {isSettingDefault && (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            )}
                                                        </div>
                                                    </th>

                                                    <th className="py-2 pr-4 w-40">Marca</th>
                                                    <th className="py-2 pr-4 w-48">Últimos dígitos</th>
                                                    <th className="py-2 pr-4 w-48">Fecha de vencimiento</th>
                                                    <th className="py-2 text-right w-32">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {debitMethods.map((paymentMethod, index) => (
                                                    <tr key={index}>
                                                        <td className="preferida-col py-2 pr-4 align-middle">
                                                            <input 
                                                                type="radio"
                                                                name="prefer-payment-method"
                                                                checked={paymentMethod.es_predeterminada}
                                                                disabled={isSettingDefault}
                                                                onChange={() => handleSetDefaultPaymentMethod(paymentMethod.id_metodo_pago)}
                                                            />
                                                        </td>

                                                        <td className="py-2 pr-4 align-middle">
                                                            <div className="flex items-center gap-2">
                                                                {paymentMethod.marca === Marcas.Visa && (
                                                                    <Image src={Visa} alt="Visa" width={32} height={20} className="w-8 h-auto" />
                                                                )}
                                                                {paymentMethod.marca === Marcas.Mastercard && (
                                                                    <Image src={Mastercard} alt="Mastercard" width={32} height={20} className="w-8 h-auto" />
                                                                )}
                                                                {paymentMethod.marca === Marcas.AmericanExpress && (
                                                                    <Image src={AmericanExpress} alt="American Express" width={32} height={20} className="w-8 h-auto" />
                                                                )}
                                                                {paymentMethod.marca === Marcas.Discover && (
                                                                    <Image src={Discover} alt="Discover" width={32} height={20} className="w-8 h-auto" />
                                                                )}
                                                                {paymentMethod.marca === Marcas.UnionPay && (
                                                                    <Image src={UnionPay} alt="Union Pay" width={32} height={20} className="w-8 h-auto" />
                                                                )}
                                                                {paymentMethod.marca === Marcas.Jcb && (
                                                                    <Image src={JCB} alt="JCB" width={32} height={20} className="w-8 h-auto" />
                                                                )}
                                                                {paymentMethod.marca === Marcas.DinersClubInternational && (
                                                                    <Image
                                                                        src={DinersClubInternational}
                                                                        alt="Diners Club"
                                                                        width={32}
                                                                        height={20}
                                                                        className="w-8 h-auto"
                                                                    />
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="ultimos-digitos-col py-2 pr-4 align-middle">
                                                            xxxx xxxx xxxx {paymentMethod.ultimos_digitos.toString().slice(-4)}
                                                        </td>
                                                        <td className="fecha-vencimiento-col py-2 pr-4 align-middle">
                                                            {paymentMethod.fecha_vencimiento.toLocaleString("en-US",
                                                            {
                                                                month: "short",
                                                                year: "numeric"
                                                            }
                                                        )}
                                                        </td>
                                                        <td className="py-2 text-right align-middle">
                                                            <Button
                                                                id="delete-debit-card"
                                                                variant="outline"
                                                                size="icon"
                                                                className="ml-2 cursor-pointer"
                                                                onClick={() => {
                                                                    setMethodPageToDelete({
                                                                        id_metodo_pago: paymentMethod.id_metodo_pago,
                                                                        tipo: paymentMethod.tipo
                                                                    })
                                                                    setIsConfirmDeleteOpen(true)
                                                                }}>
                                                                <Trash className="w-4 h-4 mr-1" />
                                                            
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        className="ml-2"
                                        onClick={() => openMethodModal("D")}>
                                        <Plus className="w-4 h-4 mr-1" />
                                        Agregar Tarjeta
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
            <Modal isOpen={isMethodModalOpen} onClose={() => { setIsMethodModalOpen(false); resetForm() }}>
                <h3 className="text-lg font-semibold mb-2">Agregar dirección</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Completa los datos requerido para la tarjeta
                </p>
                <form onSubmit={handlePaymentMethodSubmit} className="space-y-4" >
                    <div>
                            <div className="relative">
                            <Input
                                type="text"
                                value={ultimos_digitos}
                                maxLength={19}
                                className="pr-16"
                                onChange={(e) => {
                                    const raw = e.target.value
                                    const digitsOnly = raw.replace(/\D/g, "")

                                    // Formatear en grupos de 4: 0000 0000 0000 0000
                                    const groups = digitsOnly.match(/.{1,4}/g) || []
                                    const formatted = groups.join(" ")
                                    setUltimosDigitos(formatted)

                                    const firstDigit = digitsOnly.charAt(0)
                                    const firstTwoDigits = digitsOnly.slice(0, 2)
                                    const firstThreeDigits = digitsOnly.slice(0, 3)

                                    if (firstDigit === "4") {
                                        setMarca(Marcas.Visa)
                                    } else if (firstDigit === "5") {
                                        setMarca(Marcas.Mastercard)
                                    } else if (firstTwoDigits === "34" || firstTwoDigits === "37") {
                                        setMarca(Marcas.AmericanExpress)
                                    } else if (firstThreeDigits === "604" || firstThreeDigits === "622" || firstThreeDigits === "644" || firstThreeDigits === "645" || firstThreeDigits === "646" || firstThreeDigits === "647" || firstThreeDigits === "648" || firstThreeDigits === "649" || firstThreeDigits === "65") {
                                        setMarca(Marcas.Discover)
                                    } else if (firstTwoDigits === "62") {
                                        setMarca(Marcas.UnionPay)
                                    } else if (firstThreeDigits === "352" || firstThreeDigits === "353" || firstThreeDigits === "354" || firstThreeDigits === "355" || firstThreeDigits === "356" || firstThreeDigits === "357" || firstThreeDigits === "358" || firstThreeDigits === "359") {
                                        setMarca(Marcas.Jcb)
                                    } else if (firstTwoDigits === "36" || firstTwoDigits === "38" || firstThreeDigits === "300" || firstThreeDigits === "301" || firstThreeDigits === "302" || firstThreeDigits === "303" || firstThreeDigits === "304" || firstThreeDigits === "305" || firstThreeDigits === "306" || firstThreeDigits === "307" || firstThreeDigits === "308" || firstThreeDigits === "309") {
                                        setMarca(Marcas.DinersClubInternational)
                                    } else {
                                        setMarca("")
                                    }
                                }}
                                placeholder="0000 0000 0000 0000"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center gap-2">
                                {marca === Marcas.Visa && (
                                    <Image
                                        src={Visa}
                                        alt="Visa"
                                        width={32}
                                        height={20}
                                        className="w-8 h-auto mr-1"
                                    />
                                )}
                                {marca === Marcas.Mastercard && (
                                    <Image
                                        src={Mastercard}
                                        alt="Mastercard"
                                        width={32}
                                        height={20}
                                        className="w-8 h-auto mr-1"
                                    />
                                )}
                                {marca === Marcas.AmericanExpress && (
                                    <Image
                                        src={AmericanExpress}
                                        alt="American Express"
                                        width={32}
                                        height={20}
                                        className="w-8 h-auto mr-1"
                                    />
                                )}
                                {marca === Marcas.Discover && (
                                    <Image
                                        src={Discover}
                                        alt="Discover"
                                        width={32}
                                        height={20}
                                        className="w-8 h-auto mr-1"
                                    />
                                )}
                                {marca === Marcas.UnionPay && (
                                    <Image
                                        src={UnionPay}
                                        alt="Union Pay"
                                        width={32}
                                        height={20}
                                        className="w-8 h-auto mr-1"
                                    />
                                )}
                                {marca === Marcas.Jcb && (
                                    <Image
                                        src={JCB}
                                        alt="JCB"
                                        width={32}
                                        height={20}
                                        className="w-8 h-auto mr-1"
                                    />
                                )}
                                {marca === Marcas.DinersClubInternational && (
                                    <Image
                                        src={DinersClubInternational}
                                        alt="Diners Club"
                                        width={32}
                                        height={20}
                                        className="w-8 h-auto mr-1"
                                    />
                                )}
                            </div>
                        </div>

                    </div>
                    <div>
                        <Label className="block text-sm font-medium text-foreground mb-2">Fecha Vencimiento</Label>
                        <Input
                            type="text"
                            value={fecha_vencimiento}
                            onChange={handleFechaVencimientoChange}
                            maxLength={5}
                            placeholder="MM/AA"
                        />

                        <Label className="block text-sm font-medium text-foreground mb-2">Código de seguridad</Label>
                        <Input
                            type="text"
                            value={codigo_seguridad}
                            onChange={(e) => setCodigoSeguridad(e.target.value)}
                            maxLength={3}
                            placeholder="CVV"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <input
                            id="esPredeterminada"
                            type="checkbox"
                            checked={es_predeterminado}
                            onChange={(e) => setEsPredeterminado(e.target.checked)}
                            className="h-4 w-4"
                        />
                        <Label htmlFor="esPredeterminada" className="text-sm text-foreground">
                            Marcar como dirección predeterminada
                        </Label>
                    </div>
                    {paymentMethodError && (
                        <p className="text-sm text-red-500 mt-1">{paymentMethodError}</p>
                    )}
                    <div className="flex justify-end mt-4">
                        <Button
                            type="button"
                            className="cursor-pointer"
                            onClick={() => { setIsMethodModalOpen(false); resetForm() }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="ml-2 cursor-pointer"
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
                    setMethodPageToDelete(null)
                }}
            >
                <h3 className="text-lg font-semibold mb-2">Eliminar dirección</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    ¿Estás seguro de que deseas eliminar el medio de pago
                    {" "}
                    <span className="font-semibold">
                        {methodPageToDelete?.tipo ?? "seleccionada"}
                    </span>
                    ? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => {
                            setIsConfirmDeleteOpen(false)
                            setMethodPageToDelete(null)
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={saving}
                        className="cursor-pointer"
                        onClick={async () => {
                            if (!methodPageToDelete) return
                            await handleDeletePaymentMethod(methodPageToDelete.id_metodo_pago)
                            setIsConfirmDeleteOpen(false)
                            setMethodPageToDelete(null)
                        }}
                    >
                        Eliminar
                    </Button>
                </div>
            </Modal>
        </div>
    )
}
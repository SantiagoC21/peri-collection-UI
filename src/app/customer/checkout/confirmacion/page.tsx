import CheckoutConfirmacionClient from "./CheckoutConfirmacionClient"

type SearchParams = {
  [key: string]: string | string[] | undefined
}

export default async function CheckoutConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const resolvedSearchParams = await searchParams

  const idPedidoParam = resolvedSearchParams["id_pedido"]
  const transaccionParam = resolvedSearchParams["transaccion"]

  const idPedido = Array.isArray(idPedidoParam)
    ? Number(idPedidoParam[0])
    : idPedidoParam
    ? Number(idPedidoParam)
    : null

  const transaccion = Array.isArray(transaccionParam)
    ? transaccionParam[0]
    : transaccionParam ?? null

  return (
    <CheckoutConfirmacionClient
      idPedido={idPedido}
      transaccion={transaccion}
    />
  )
}

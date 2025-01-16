import { useState } from 'react';
import { useForm } from 'react-hook-form';

// Temporary mock data
const mockClients = [
  { id: 1, name: 'Firma A', nip: '1234567890' },
  { id: 2, name: 'Firma B', nip: '0987654321' },
];

const mockProducts = [
  { id: 1, name: 'Produkt 1', netPrice: 100, vatRate: 23 },
  { id: 2, name: 'Produkt 2', netPrice: 200, vatRate: 23 },
];

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const { register, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      items: [{ productId: '', quantity: 1, netPrice: 0, vatRate: 23 }],
    },
  });

  const calculateTotals = (items) => {
    return items.reduce(
      (acc, item) => {
        const netAmount = item.netPrice * item.quantity;
        const vatAmount = (netAmount * item.vatRate) / 100;
        return {
          netTotal: acc.netTotal + netAmount,
          vatTotal: acc.vatTotal + vatAmount,
          grossTotal: acc.grossTotal + netAmount + vatAmount,
        };
      },
      { netTotal: 0, vatTotal: 0, grossTotal: 0 }
    );
  };

  const onSubmit = (data) => {
    const totals = calculateTotals(data.items);
    const newInvoice = {
      id: Date.now(),
      number: `FV/${new Date().getFullYear()}/${invoices.length + 1}`,
      issueDate: data.issueDate,
      clientId: data.clientId,
      items: data.items,
      ...totals,
    };
    setInvoices([...invoices, newInvoice]);
    setIsCreating(false);
    reset();
  };

  const handleProductSelect = (index, productId) => {
    const product = mockProducts.find((p) => p.id === parseInt(productId));
    if (product) {
      setValue(`items.${index}.netPrice`, product.netPrice);
      setValue(`items.${index}.vatRate`, product.vatRate);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Faktury</h1>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Dodaj fakturę
          </button>
        </div>
      </div>

      {isCreating && (
        <div className="mt-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 divide-y divide-gray-200">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Data wystawienia
                  </label>
                  <input
                    type="date"
                    {...register('issueDate')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Klient
                  </label>
                  <select
                    {...register('clientId')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Wybierz klienta</option>
                    {mockClients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name} (NIP: {client.nip})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 bg-gray-50 p-4 text-sm font-medium text-gray-700">
                  <div className="col-span-4">Produkt</div>
                  <div className="col-span-2">Ilość</div>
                  <div className="col-span-2">Cena netto</div>
                  <div className="col-span-2">VAT %</div>
                  <div className="col-span-2">Wartość brutto</div>
                </div>

                {watch('items').map((item, index) => {
                  const netAmount = item.netPrice * item.quantity;
                  const vatAmount = (netAmount * item.vatRate) / 100;
                  const grossAmount = netAmount + vatAmount;

                  return (
                    <div key={index} className="grid grid-cols-12 gap-4">
                      <div className="col-span-4">
                        <select
                          {...register(`items.${index}.productId`)}
                          onChange={(e) => handleProductSelect(index, e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="">Wybierz produkt</option>
                          {mockProducts.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          {...register(`items.${index}.quantity`)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.netPrice`)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          {...register(`items.${index}.vatRate`)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <span className="block w-full py-2 px-3 text-gray-700">
                          {grossAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                >
                  Zapisz fakturę
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    Numer
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Data
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Klient
                  </th>
                  <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                    Netto
                  </th>
                  <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                    VAT
                  </th>
                  <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                    Brutto
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                      {invoice.number}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {invoice.issueDate}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {mockClients.find(c => c.id === parseInt(invoice.clientId))?.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-500">
                      {invoice.netTotal.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-500">
                      {invoice.vatTotal.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-500">
                      {invoice.grossTotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
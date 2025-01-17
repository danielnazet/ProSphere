import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { loadFromStorage, saveToStorage } from "../utils/localStorage";
import * as XLSX from "xlsx";
import {
	PencilSquareIcon,
	ArrowDownTrayIcon,
	ArrowUpTrayIcon,
	PrinterIcon,
	DocumentTextIcon,
	ChartBarIcon,
	CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function Clients() {
	const [clients, setClients] = useState(() => loadFromStorage("CLIENTS"));
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingClient, setEditingClient] = useState(null);
	const [selectedClients, setSelectedClients] = useState([]);
	const { register, handleSubmit, reset, setValue } = useForm();

	useEffect(() => {
		saveToStorage("CLIENTS", clients);
	}, [clients]);

	const handleExport = () => {
		// Determine which clients to export
		const clientsToExport =
			selectedClients.length > 0 ? selectedClients : clients;

		// Prepare data for export
		const exportData = clientsToExport.map((client) => ({
			"Nazwa firmy": client.name,
			NIP: client.nip,
			Ulica: client.street,
			"Kod pocztowy": client.postalCode,
			Miasto: client.city,
			Email: client.email,
			Telefon: client.phone,
		}));

		// Create worksheet
		const ws = XLSX.utils.json_to_sheet(exportData);

		// Create workbook
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Klienci");

		// Generate file name with current date
		const date = new Date().toISOString().split("T")[0];
		const fileName = `klienci_${date}.xlsx`;

		// Save file
		XLSX.writeFile(wb, fileName);
	};

	const handleEdit = (client) => {
		setEditingClient(client);
		setIsFormOpen(true);
		// Pre-fill form with client data
		Object.keys(client).forEach((key) => {
			if (key !== "id" && key !== "createdAt") {
				setValue(key, client[key]);
			}
		});
	};

	const handleBulkEdit = () => {
		if (selectedClients.length === 0) {
			alert("Zaznacz klientów w tabeli, aby edytować wiele na raz");
			return;
		}
		// For now, edit the first selected client
		handleEdit(selectedClients[0]);
	};

	const toggleClientSelection = (client) => {
		setSelectedClients((prev) => {
			const isSelected = prev.some((c) => c.id === client.id);
			if (isSelected) {
				return prev.filter((c) => c.id !== client.id);
			} else {
				return [...prev, client];
			}
		});
	};

	const onSubmit = (data) => {
		if (editingClient) {
			// Update existing client
			const updatedClients = clients.map((client) =>
				client.id === editingClient.id
					? {
							...client,
							...data,
							updatedAt: new Date().toISOString(),
					  }
					: client
			);
			setClients(updatedClients);
			setEditingClient(null);
		} else {
			// Create new client
			const newClient = {
				id: Date.now(),
				...data,
				createdAt: new Date().toISOString(),
			};
			setClients([...clients, newClient]);
		}
		setIsFormOpen(false);
		reset();
	};

	const handleCancel = () => {
		setIsFormOpen(false);
		setEditingClient(null);
		reset();
	};

	return (
		<div className="px-4 sm:px-6 lg:px-8">
			<div className="sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-2xl font-semibold text-gray-900">
						Klienci
					</h1>
					<div className="mt-4 flex flex-wrap gap-2">
						<button
							type="button"
							onClick={handleBulkEdit}
							className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
						>
							<PencilSquareIcon className="h-5 w-5 mr-2 text-gray-500" />
							Edytuj
						</button>
						<button
							type="button"
							onClick={handleExport}
							className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
						>
							<ArrowDownTrayIcon className="h-5 w-5 mr-2 text-gray-500" />
							Eksportuj
						</button>
						<button
							type="button"
							className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
						>
							<ArrowUpTrayIcon className="h-5 w-5 mr-2 text-gray-500" />
							Import
						</button>
						<button
							type="button"
							className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
						>
							<PrinterIcon className="h-5 w-5 mr-2 text-gray-500" />
							Drukuj
						</button>
						<button
							type="button"
							className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
						>
							<DocumentTextIcon className="h-5 w-5 mr-2 text-gray-500" />
							Zestawienie
						</button>
						<button
							type="button"
							className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
						>
							<ChartBarIcon className="h-5 w-5 mr-2 text-gray-500" />
							Wykres
						</button>
					</div>
				</div>
				<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
					<button
						type="button"
						onClick={() => setIsFormOpen(true)}
						className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
					>
						Dodaj klienta
					</button>
				</div>
			</div>

			{isFormOpen && (
				<div className="mt-8">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-8 divide-y divide-gray-200"
					>
						<div className="space-y-6 sm:space-y-5">
							{/* Podstawowe informacje */}
							<div>
								<h3 className="text-lg font-medium leading-6 text-gray-900">
									Podstawowe informacje
								</h3>
								<div className="mt-6 space-y-6 sm:space-y-5">
									<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
										<label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
											Nazwa firmy
										</label>
										<div className="mt-1 sm:col-span-2 sm:mt-0">
											<input
												type="text"
												{...register("name", {
													required: true,
												})}
												className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											/>
										</div>
									</div>

									<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
										<label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
											NIP
										</label>
										<div className="mt-1 sm:col-span-2 sm:mt-0">
											<input
												type="text"
												{...register("nip", {
													required: true,
												})}
												className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											/>
										</div>
									</div>
								</div>
							</div>

							{/* Adres firmy */}
							<div className="pt-8">
								<h3 className="text-lg font-medium leading-6 text-gray-900">
									Adres firmy
								</h3>
								<div className="mt-6 space-y-6 sm:space-y-5">
									<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
										<label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
											Ulica i numer
										</label>
										<div className="mt-1 sm:col-span-2 sm:mt-0">
											<input
												type="text"
												{...register("street", {
													required: true,
												})}
												className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											/>
										</div>
									</div>

									<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
										<label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
											Kod pocztowy
										</label>
										<div className="mt-1 sm:col-span-2 sm:mt-0">
											<input
												type="text"
												{...register("postalCode", {
													required: true,
												})}
												className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											/>
										</div>
									</div>

									<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
										<label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
											Miasto
										</label>
										<div className="mt-1 sm:col-span-2 sm:mt-0">
											<input
												type="text"
												{...register("city", {
													required: true,
												})}
												className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											/>
										</div>
									</div>
								</div>
							</div>

							{/* Dane kontaktowe */}
							<div className="pt-8">
								<h3 className="text-lg font-medium leading-6 text-gray-900">
									Dane kontaktowe
								</h3>
								<div className="mt-6 space-y-6 sm:space-y-5">
									<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
										<label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
											Email
										</label>
										<div className="mt-1 sm:col-span-2 sm:mt-0">
											<input
												type="email"
												{...register("email")}
												className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											/>
										</div>
									</div>

									<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
										<label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
											Telefon
										</label>
										<div className="mt-1 sm:col-span-2 sm:mt-0">
											<input
												type="tel"
												{...register("phone")}
												className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="pt-5">
							<div className="flex justify-end space-x-3">
								<button
									type="button"
									onClick={handleCancel}
									className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
								>
									Anuluj
								</button>
								<button
									type="submit"
									className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
								>
									{editingClient ? "Zapisz zmiany" : "Zapisz"}
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
									<th className="relative px-7 sm:w-12 sm:px-6">
										<span className="sr-only">Zaznacz</span>
									</th>
									<th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
										Nazwa
									</th>
									<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
										NIP
									</th>
									<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
										Adres
									</th>
									<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
										Email
									</th>
									<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
										Telefon
									</th>
									<th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
										<span className="sr-only">Edytuj</span>
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{clients.map((client) => (
									<tr key={client.id}>
										<td className="relative px-7 sm:w-12 sm:px-6">
											<div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
											<input
												type="checkbox"
												className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
												checked={selectedClients.some(
													(c) => c.id === client.id
												)}
												onChange={() =>
													toggleClientSelection(
														client
													)
												}
											/>
										</td>
										<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
											{client.name}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
											{client.nip}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
											{client.street}, {client.postalCode}{" "}
											{client.city}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
											{client.email}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
											{client.phone}
										</td>
										<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
											<button
												onClick={() =>
													handleEdit(client)
												}
												className="text-indigo-600 hover:text-indigo-900"
											>
												<PencilSquareIcon className="h-5 w-5" />
												<span className="sr-only">
													Edytuj {client.name}
												</span>
											</button>
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

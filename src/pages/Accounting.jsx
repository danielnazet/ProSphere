import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { loadFromStorage, saveToStorage } from "../utils/localStorage";

export default function Accounting() {
	const [transactions, setTransactions] = useState(() =>
		loadFromStorage("TRANSACTIONS")
	);
	const [isCreating, setIsCreating] = useState(false);
	const { register, handleSubmit, reset } = useForm();

	useEffect(() => {
		saveToStorage("TRANSACTIONS", transactions);
	}, [transactions]);

	const onSubmit = (data) => {
		const newTransaction = {
			id: Date.now(),
			...data,
			amount: parseFloat(data.amount),
			date: new Date(data.date).toISOString(),
		};
		setTransactions([...transactions, newTransaction]);
		setIsCreating(false);
		reset();
	};

	return (
		<div className="px-4 sm:px-6 lg:px-8">
			<div className="sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-2xl font-semibold text-gray-900">
						Księgowość
					</h1>
				</div>
				<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
					<button
						type="button"
						onClick={() => setIsCreating(true)}
						className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
					>
						Dodaj transakcję
					</button>
				</div>
			</div>

			{isCreating && (
				<div className="mt-8">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-8 divide-y divide-gray-200"
					>
						<div className="space-y-6 sm:space-y-5">
							<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
								<label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
									Data
								</label>
								<div className="mt-1 sm:col-span-2 sm:mt-0">
									<input
										type="date"
										{...register("date", {
											required: true,
										})}
										className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									/>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
								<label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
									Typ
								</label>
								<div className="mt-1 sm:col-span-2 sm:mt-0">
									<select
										{...register("type", {
											required: true,
										})}
										className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									>
										<option value="income">Przychód</option>
										<option value="expense">Wydatek</option>
									</select>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
								<label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
									Kwota
								</label>
								<div className="mt-1 sm:col-span-2 sm:mt-0">
									<input
										type="number"
										step="0.01"
										{...register("amount", {
											required: true,
											min: 0,
										})}
										className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									/>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
								<label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
									Kategoria
								</label>
								<div className="mt-1 sm:col-span-2 sm:mt-0">
									<input
										type="text"
										{...register("category", {
											required: true,
										})}
										className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									/>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
								<label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
									Opis
								</label>
								<div className="mt-1 sm:col-span-2 sm:mt-0">
									<textarea
										{...register("description")}
										rows={3}
										className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									/>
								</div>
							</div>
						</div>

						<div className="pt-5">
							<div className="flex justify-end space-x-3">
								<button
									type="button"
									onClick={() => setIsCreating(false)}
									className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
								>
									Anuluj
								</button>
								<button
									type="submit"
									className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
								>
									Zapisz
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
										Data
									</th>
									<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
										Typ
									</th>
									<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
										Kategoria
									</th>
									<th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
										Kwota
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{transactions.map((transaction) => (
									<tr key={transaction.id}>
										<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
											{new Date(
												transaction.date
											).toLocaleDateString()}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
											{transaction.type === "income"
												? "Przychód"
												: "Wydatek"}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
											{transaction.category}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-500">
											<span
												className={
													transaction.type ===
													"income"
														? "text-green-600"
														: "text-red-600"
												}
											>
												{transaction.type === "income"
													? "+"
													: "-"}{" "}
												{transaction.amount.toFixed(2)}{" "}
												PLN
											</span>
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

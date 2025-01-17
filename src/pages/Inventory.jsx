import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { loadFromStorage, saveToStorage } from "../utils/localStorage";

export default function Inventory() {
	const [products, setProducts] = useState(() => loadFromStorage("PRODUCTS"));
	const [isCreating, setIsCreating] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);
	const { register, handleSubmit, reset, setValue } = useForm();

	useEffect(() => {
		saveToStorage("PRODUCTS", products);
	}, [products]);

	const onSubmit = (data) => {
		if (editingProduct) {
			// Update existing product
			const updatedProducts = products.map((product) =>
				product.id === editingProduct.id
					? {
							...product,
							...data,
							updatedAt: new Date().toISOString(),
					  }
					: product
			);
			setProducts(updatedProducts);
			setEditingProduct(null);
		} else {
			// Create new product
			const newProduct = {
				id: Date.now(),
				...data,
				createdAt: new Date().toISOString(),
			};
			setProducts([...products, newProduct]);
		}
		setIsCreating(false);
		reset();
	};

	const handleEdit = (product) => {
		setEditingProduct(product);
		setIsCreating(true);
		// Pre-fill form with product data
		Object.keys(product).forEach((key) => {
			if (key !== "id" && key !== "createdAt" && key !== "updatedAt") {
				setValue(key, product[key]);
			}
		});
	};

	const handleCancel = () => {
		setIsCreating(false);
		setEditingProduct(null);
		reset();
	};

	return (
		<div className="px-4 sm:px-6 lg:px-8">
			<div className="sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-2xl font-semibold text-gray-900">
						Magazyn
					</h1>
				</div>
				<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
					<button
						type="button"
						onClick={() => setIsCreating(true)}
						className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
					>
						Dodaj produkt
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
									Nazwa produktu
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
									Numer katalogowy
								</label>
								<div className="mt-1 sm:col-span-2 sm:mt-0">
									<input
										type="text"
										{...register("sku", { required: true })}
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
										{...register("category")}
										className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									/>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
								<label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
									Ilość
								</label>
								<div className="mt-1 sm:col-span-2 sm:mt-0">
									<input
										type="number"
										min="0"
										{...register("quantity", {
											required: true,
											min: 0,
										})}
										className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									/>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
								<label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
									Cena jednostkowa
								</label>
								<div className="mt-1 sm:col-span-2 sm:mt-0">
									<input
										type="number"
										step="0.01"
										min="0"
										{...register("price", {
											required: true,
											min: 0,
										})}
										className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									/>
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
									{editingProduct
										? "Zapisz zmiany"
										: "Dodaj produkt"}
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
										Nazwa
									</th>
									<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
										Numer katalogowy
									</th>
									<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
										Kategoria
									</th>
									<th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
										Ilość
									</th>
									<th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
										Cena
									</th>
									<th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
										Akcje
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{products.map((product) => (
									<tr key={product.id}>
										<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
											{product.name}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
											{product.sku}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
											{product.category}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-500">
											{product.quantity}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-500">
											{parseFloat(product.price).toFixed(
												2
											)}{" "}
											PLN
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-right">
											<button
												onClick={() =>
													handleEdit(product)
												}
												className="text-indigo-600 hover:text-indigo-900"
											>
												Edytuj
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

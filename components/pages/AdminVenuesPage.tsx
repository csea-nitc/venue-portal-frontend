"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { StatCard } from "@/components/Card";
import { Table, TableCell, TableRow } from "@/components/Table";
import { Plus, Loader2, AlertCircle, Trash2, Edit } from "lucide-react";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { useFetch } from "@/hooks/useFetch";
import { cn } from "@/lib/utils";

export function AdminVenuesPage() {
	const {
		data: venuesData,
		isLoading: isFetching,
		error: fetchError,
		sendRequest: fetchVenues,
	} = useFetch();
	const { isLoading: isSubmitting, sendRequest: saveVenue } = useFetch();
	const { sendRequest: deleteVenue } = useFetch();

	const [isOpen, setIsOpen] = useState(false);
	const [editId, setEditId] = useState<number | null>(null);

	// Form states
	const [name, setName] = useState("");
	const [venueType, setVenueType] = useState("HALL");
	const [location, setLocation] = useState("");
	const [capacity, setCapacity] = useState("");
	const [isAvailable, setIsAvailable] = useState(true);

	useEffect(() => {
		fetchVenues("/api/admin/venues");
	}, [fetchVenues]);

	const handleOpenAdd = () => {
		setEditId(null);
		setName("");
		setVenueType("HALL");
		setLocation("");
		setCapacity("");
		setIsAvailable(true);
		setIsOpen(true);
	};

	const handleOpenEdit = (venue: any) => {
		setEditId(venue.venueId);
		setName(venue.name);
		setVenueType(venue.venueType);
		setLocation(venue.location);
		setCapacity(String(venue.capacity));
		setIsAvailable(venue.isAvailable);
		setIsOpen(true);
	};

	const handleSave = async () => {
		if (!name || !location || !capacity) {
			alert("Please fill in all required fields.");
			return;
		}

		try {
			const payload = {
				name,
				venueType,
				location,
				capacity: parseInt(capacity) || 0,
				isAvailable,
			};

			if (editId) {
				await saveVenue(`/api/admin/venues/${editId}`, {
					method: "PUT",
					body: payload,
				});
			} else {
				await saveVenue("/api/admin/venues", {
					method: "POST",
					body: payload,
				});
			}
			setIsOpen(false);
			fetchVenues("/api/admin/venues");
		} catch (err) {
			console.error("Save venue failed:", err);
		}
	};

	const handleDelete = async (id: number) => {
		if (confirm("Are you sure you want to delete this venue?")) {
			try {
				await deleteVenue(`/api/admin/venues/${id}`, { method: "DELETE" });
				fetchVenues("/api/admin/venues");
			} catch (err) {
				console.error("Delete venue failed:", err);
			}
		}
	};

	const venues = (venuesData as any)?.venues || [];
	const stats = {
		total: venues.length,
		available: venues.filter((v: any) => v.isAvailable).length,
		unavailable: venues.filter((v: any) => !v.isAvailable).length,
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-xl font-bold text-gray-800">Venue Management</h1>
					<p className="text-xs text-gray-500">
						Configure department halls, labs, and classrooms
					</p>
				</div>
				<Button variant="primary" size="sm" onPress={handleOpenAdd}>
					<Plus className="w-4 h-4 inline mr-1" /> Add Venue
				</Button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<StatCard title="Total Venues" value={stats.total.toString()} />
				<StatCard title="Available" value={stats.available.toString()} />
				<StatCard
					title="Unavailable"
					value={stats.unavailable.toString()}
					variant="danger"
				/>
			</div>

			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
				{isFetching ? (
					<div className="flex justify-center py-12">
						<Loader2 className="w-10 h-10 animate-spin text-accent" />
					</div>
				) : fetchError ? (
					<div className="p-6 text-center text-red-600 flex flex-col items-center gap-2">
						<AlertCircle className="w-10 h-10" />
						<p>{fetchError}</p>
						<Button
							variant="outline"
							size="sm"
							onPress={() => fetchVenues("/api/admin/venues")}
						>
							Retry
						</Button>
					</div>
				) : (
					<Table
						headers={[
							"Name",
							"Type",
							"Location",
							"Capacity",
							"Status",
							"Actions",
						]}
					>
						{venues.length === 0 ? (
							<TableRow>
								<TableCell className="text-center py-8 text-gray-500 italic">
									No venues found
								</TableCell>
								<TableCell>-</TableCell>
								<TableCell>-</TableCell>
								<TableCell>-</TableCell>
								<TableCell>-</TableCell>
								<TableCell>-</TableCell>
							</TableRow>
						) : (
							venues.map((venue: any) => (
								<TableRow key={venue.venueId}>
									<TableCell className="font-bold text-gray-800">
										{venue.name}
									</TableCell>
									<TableCell>
										<span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">
											{venue.venueType}
										</span>
									</TableCell>
									<TableCell className="text-sm">{venue.location}</TableCell>
									<TableCell className="text-sm font-medium">
										{venue.capacity}
									</TableCell>
									<TableCell>
										<span
											className={cn(
												"px-2 py-0.5 rounded-full text-[10px] font-bold border",
												venue.isAvailable
													? "bg-green-50 text-green-700 border-green-200"
													: "bg-red-50 text-red-700 border-red-200",
											)}
										>
											{venue.isAvailable ? "AVAILABLE" : "MAINTENANCE"}
										</span>
									</TableCell>
									<TableCell>
										<div className="flex gap-2">
											<Button
												size="sm"
												variant="outline"
												onPress={() => handleOpenEdit(venue)}
											>
												<Edit className="w-3.5 h-3.5" />
											</Button>
											<Button
												size="sm"
												variant="danger"
												onPress={() => handleDelete(venue.venueId)}
											>
												<Trash2 className="w-3.5 h-3.5" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</Table>
				)}
			</div>

			<Modal
				isOpen={isOpen}
				onOpenChange={setIsOpen}
				title={editId ? "Edit Venue" : "Add New Venue"}
			>
				<div className="space-y-4 p-1">
					<Input
						label="Venue Name"
						value={name}
						onChange={(e) => setName((e.target as HTMLInputElement).value)}
						placeholder="e.g. APJ Hall"
					/>
					<Select
						label="Venue Type"
						selectedKey={venueType}
						onSelectionChange={(key) => setVenueType(key as string)}
						options={[
							{ id: "HALL", label: "Hall" },
							{ id: "LAB", label: "Lab" },
							{ id: "CLASSROOM", label: "Classroom" },
						]}
					/>
					<Input
						label="Location"
						value={location}
						onChange={(e) => setLocation((e.target as HTMLInputElement).value)}
						placeholder="Building, Floor"
					/>
					<Input
						label="Capacity"
						type="number"
						value={capacity}
						onChange={(e) => setCapacity((e.target as HTMLInputElement).value)}
						placeholder="Number of seats"
					/>
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							id="isAvailable"
							checked={isAvailable}
							onChange={(e) => setIsAvailable(e.target.checked)}
							className="w-4 h-4 text-accent rounded focus:ring-accent"
						/>
						<label
							htmlFor="isAvailable"
							className="text-sm font-medium text-gray-700 cursor-pointer"
						>
							Venue is available for booking
						</label>
					</div>

					<div className="flex gap-3 pt-4">
						<Button
							variant="primary"
							className="flex-1"
							onPress={handleSave}
							isDisabled={isSubmitting}
						>
							{isSubmitting ? (
								<Loader2 className="w-4 h-4 animate-spin mr-2" />
							) : null}
							{editId ? "Update Venue" : "Create Venue"}
						</Button>
						<Button
							variant="outline"
							className="flex-1"
							onPress={() => setIsOpen(false)}
						>
							Cancel
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
}

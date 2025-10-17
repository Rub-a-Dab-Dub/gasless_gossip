"use client";

import React, { useEffect, useState } from "react";
import { IRoomCategory, IRoom } from "@/types/room";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { ApiResponse } from "@/types/api";
import RoomCard from "@/components/room/RoomCard";

export default function AllRooms() {
    const [roomCategories, setRoomCategories] = useState<IRoomCategory[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        null
    );
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingRooms, setLoadingRooms] = useState(true);

    useEffect(() => {
        const fetchRoomCategories = async () => {
            try {
                setLoadingCategories(true);
                const res = await api.get<ApiResponse<IRoomCategory[]>>(
                    "/room-categories"
                );
                if (res.data.error) {
                    toast.error(res.data.message || "Failed to load room categories");
                } else {
                    setRoomCategories(res.data.data || []);
                }
            } catch (error: any) {
                console.error(error);
                toast.error("An error occurred while fetching room categories");
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchRoomCategories();
    }, []);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoadingRooms(true);
                const url =
                    selectedCategoryId !== null
                        ? `/rooms?categoryId=${selectedCategoryId}`
                        : "/rooms";
                const res = await api.get<ApiResponse<IRoom[]>>(url);
                if (res.data.error) {
                    toast.error(res.data.message || "Failed to load all rooms");
                } else {
                    setRooms(res.data.data || []);
                }
            } catch (error: any) {
                console.error(error);
                toast.error("An error occurred while fetching all rooms");
            } finally {
                setLoadingRooms(false);
            }
        };

        fetchRooms();
    }, [selectedCategoryId]);

    return (
        <div>
            {/* Room Categories */}
            <ul className="mb-2b flex items-center flex-row overflow-x-auto gap-2 pb-2">
                {loadingCategories ? (
                    <p className="text-gray-400 w-full text-center py-8">Loading categories...</p>
                ) : roomCategories.length > 0 ? (
                    roomCategories.map((category) => (
                        <li
                            key={category.id}
                            onClick={() =>
                                setSelectedCategoryId(
                                    selectedCategoryId === category.id ? null : category.id
                                )
                            }
                            className={`inline-flex items-center rounded-lg border py-1.5 px-3 text-light-grey cursor-pointer hover:border-light-teal transition ${selectedCategoryId === category.id
                                ? "bg-zinc-800 border-light-teal"
                                : "border-dark-teal"
                                }`}
                        >
                            {category.title}
                        </li>
                    ))
                ) : (
                    <p className="text-gray-400 w-full text-center py-8">No room categories found.</p>
                )}
            </ul>

            {/* Rooms List */}
            <div className="space-y-6">
                {loadingRooms ? (
                    <p className="text-gray-400 w-full text-center py-8">Loading all rooms...</p>
                ) : rooms.length > 0 ? (
                    rooms.map((room) => (
                        <RoomCard
                            key={room.id}
                            room={room}
                            action={false}
                        />
                    ))
                ) : (
                    <p className="text-gray-400 w-full text-center py-8">No rooms found.</p>
                )}
            </div>
        </div>
    );
}

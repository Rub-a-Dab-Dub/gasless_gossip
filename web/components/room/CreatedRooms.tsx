"use client";

import React, { useEffect, useState } from "react";
import { IRoom } from "@/types/room";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { ApiResponse } from "@/types/api";
import RoomCard from "@/components/room/RoomCard";

export default function CreatedRooms() {
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [loadingRooms, setLoadingRooms] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoadingRooms(true);
                const url = "/rooms/created";
                const res = await api.get<ApiResponse<IRoom[]>>(url);
                if (res.data.error) {
                    toast.error(res.data.message || "Failed to load created rooms");
                } else {
                    setRooms(res.data.data || []);
                }
            } catch (error: any) {
                console.error(error);
                toast.error("An error occurred while fetching created rooms");
            } finally {
                setLoadingRooms(false);
            }
        };

        fetchRooms();
    }, []);

    return (
        <div>
            {/* Rooms List */}
            <div className="space-y-6">
                {loadingRooms ? (
                    <p className="text-gray-400 w-full text-center py-8">Loading created rooms...</p>
                ) : rooms.length > 0 ? (
                    rooms.map((room) => (
                        <RoomCard
                            key={room.id}
                            room={room}
                            action={true}
                        />
                    ))
                ) : (
                    <p className="text-gray-400 w-full text-center py-8">No rooms created yet.</p>
                )}
            </div>
        </div>
    );
}

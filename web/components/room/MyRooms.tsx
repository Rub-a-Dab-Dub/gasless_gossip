"use client";

import React, { useEffect, useState } from "react";
import { IRoom } from "@/types/room";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { ApiResponse } from "@/types/api";
import RoomCard from "@/components/room/RoomCard";

export default function MyRooms() {
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [loadingRooms, setLoadingRooms] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoadingRooms(true);
                const url = "/rooms/me";
                const res = await api.get<ApiResponse<IRoom[]>>(url);
                if (res.data.error) {
                    toast.error(res.data.message || "Failed to load rooms");
                } else {
                    setRooms(res.data.data || []);
                }
            } catch (error: any) {
                console.error(error);
                toast.error("An error occurred while fetching rooms");
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
                    <p className="text-gray-400 w-full text-center py-8">Loading my rooms...</p>
                ) : rooms.length > 0 ? (
                    rooms.map((room) => (
                        <RoomCard
                            key={room.id}
                            room={room}
                            action={true}
                        />
                    ))
                ) : (
                    <p className="text-gray-400 w-full text-center py-8">You are yet to create or join a room.</p>
                )}
            </div>
        </div>
    );
}
